export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "../../utils/response";

// TODO: hier später dein AI-call rein
async function aiFillSubmission(sub: {
  question: string;
  correctAnswer: string;
  wrongAnswerA?: string | null;
  wrongAnswerB?: string | null;
  lat?: number | null;
  lng?: number | null;
  email?: string | null;
}) {
  // Minimaler Dummy-Output, damit Pipeline steht.
  // Ersetze das später durch echten AI Output.
  const answers = [
    sub.correctAnswer,
    sub.wrongAnswerA ?? "Platzhalter A",
    sub.wrongAnswerB ?? "Platzhalter B",
  ];

  return {
    category: "geography" as const,     // TODO: AI entscheidet
    question: sub.question,
    answers,
    correctIndex: 0,
    lat: sub.lat ?? 52.52,
    lng: sub.lng ?? 13.405,
    country: "Deutschland",
    fact: "AI Fact placeholder",
  };
}

export async function POST(_: NextRequest) {
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

    // 2) AI anwerfen
    const ai = await aiFillSubmission({
      question: claimed.question,
      correctAnswer: claimed.correctAnswer,
      wrongAnswerA: claimed.wrongAnswerA,
      wrongAnswerB: claimed.wrongAnswerB,
      lat: claimed.lat,
      lng: claimed.lng,
      email: claimed.email,
    });

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

  } catch (e) {
    console.error("process-next failed:", e);

    if (claimed) {
      await prisma.questionSubmission.update({
        where: { id: claimed.id },
        data: { status: "rejected" },
      });
    }

    return fail("Failed to process submission", 500);
  }
}

