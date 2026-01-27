export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { ZodError } from "zod";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "../../utils/response";
import { AiQuestionPartialSchema, AiQuestionSchema } from "@/lib/schemas/ai_question.schema";
import { buildBaseFromSubmission, mergeAiIntoBase } from "@/lib/helpers/mergeAiIntoBase";
import { aiFillSubmission } from "@/lib/ai/openaiFillSubmission";



function nullToUndefined<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v])
  );
}

function isRetryableOpenAIErrorMessage(msg: string) {
  const m = msg.toLowerCase();
  return (
    m.includes("429") ||
    m.includes("quota") ||
    m.includes("rate limit") ||
    m.includes("timeout") ||
    m.includes("temporarily") ||
    m.includes("overloaded") ||
    m.includes("server error") ||
    m.includes("503") ||
    m.includes("502") ||
    m.includes("504")
  );
}

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  return String(e);
}

export async function POST(_: NextRequest) {
  console.log("🔥 process-next called");

  let claimed: {
    id: string;
    question: string;
    correctAnswer: string;
    wrongAnswerA?: string | null;
    wrongAnswerB?: string | null;
    lat?: number | null;
    lng?: number | null;
    email?: string | null;
  } | null = null;

  try {
    // 1) nächste pending Submission "claimen"
    claimed = await prisma.$transaction(async (tx) => {
      const next = await tx.questionSubmission.findFirst({
        where: { status: "pending" },
        orderBy: { createdAt: "asc" },
      });
      if (!next) return null;

      const res = await tx.questionSubmission.updateMany({
        where: { id: next.id, status: "pending" },
        data: { status: "processing" },
      });

      if (res.count !== 1) return null;

      return tx.questionSubmission.findUnique({ where: { id: next.id } });
    });

    if (!claimed) {
      return ok({ message: "No pending submissions (or already claimed)" });
    }

    const base = buildBaseFromSubmission({
      question: claimed.question,
      correctAnswer: claimed.correctAnswer,
      wrongAnswerA: claimed.wrongAnswerA,
      wrongAnswerB: claimed.wrongAnswerB,
      lat: claimed.lat,
      lng: claimed.lng,
    });

    // 2) AI anwerfen
    const aiRaw = await aiFillSubmission(
      {
        question: claimed.question,
        correctAnswer: claimed.correctAnswer,
        wrongAnswerA: claimed.wrongAnswerA,
        wrongAnswerB: claimed.wrongAnswerB,
        lat: claimed.lat,
        lng: claimed.lng,
        email: claimed.email,
      },
      base
    );


    // 1) AI partial validieren (darf Felder weglassen)
    const aiPartial = AiQuestionPartialSchema.parse(nullToUndefined(aiRaw));

    // 2) Merge: User first
    const merged = mergeAiIntoBase(base, aiPartial);

    // 3) Final full validation (muss komplett sein)
    const ai = AiQuestionSchema.parse(merged);

    // 3) echte Question erzeugen
    const createdQuestion = await prisma.question.create({
      data: {
        category: ai.category,
        question: ai.question,
        answers: ai.answers,
        correctIndex: ai.correctIndex,
        lat: ai.lat,
        lng: ai.lng,
        country: ai.country,
        fact: ai.fact,
        createdBy: "user",
        status: "pending",
      },
    });

    // 4) Submission finalisieren
    await prisma.questionSubmission.update({
      where: { id: claimed.id },
      data: {
        status: "accepted",
        generatedQuestionId: createdQuestion.id,
      },
    });

    return ok({
      submissionId: claimed.id,
      createdQuestionId: createdQuestion.id,
    });

  } catch (e: unknown) {
    console.error("process-next failed:", e);

    if (claimed) {
      const msg = getErrorMessage(e);

      // A) AI Output invalid -> reject (hard failure, not retryable)
      if (e instanceof ZodError) {
        await prisma.questionSubmission.update({
          where: { id: claimed.id },
          data: {
            status: "rejected",
            rejectReason:
              "AI output validation failed: " +
              JSON.stringify(e.flatten().fieldErrors).slice(0, 800),
          },
        });
        return fail("Failed to process submission", 500);
      }

      // B) Auth/config errors -> reject (hard failure)
      if (msg.includes("401") || msg.toLowerCase().includes("unauthorized") ||
          msg.includes("403") || msg.toLowerCase().includes("forbidden") ||
          msg.toLowerCase().includes("missing openai_api_key")) {
        await prisma.questionSubmission.update({
          where: { id: claimed.id },
          data: {
            status: "rejected",
            rejectReason: msg.slice(0, 800),
          },
        });
        return fail("Failed to process submission", 500);
      }

      // C) Retryable errors (429/quota/rate-limit/timeouts/5xx) -> back to pending
      if (isRetryableOpenAIErrorMessage(msg)) {
        await prisma.questionSubmission.update({
          where: { id: claimed.id },
          data: {
            status: "pending",
            rejectReason: null, // optional: keep clean
          },
        });
        // Optional: return ok so cron doesn't mark it as failure
        return ok({ message: "Retryable failure. Submission returned to pending." });
      }

      // D) Unknown non-retryable -> reject (safe default)
      await prisma.questionSubmission.update({
        where: { id: claimed.id },
        data: {
          status: "rejected",
          rejectReason: msg.slice(0, 800),
        },
      });
    }

    return fail("Failed to process submission", 500);
  }


}

