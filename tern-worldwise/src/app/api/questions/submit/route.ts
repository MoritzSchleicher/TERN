export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "../../utils/response";
import { z } from "zod";

const SubmissionCreate = z.object({
  question: z.string().min(1).max(300),
  correct_answer: z.string().min(1).max(200),

  wrong_answer_a: z.string().min(1).max(200).optional(),
  wrong_answer_b: z.string().min(1).max(200).optional(),

  lat: z.number().min(-90).max(90).optional(),
  long: z.number().min(-180).max(180).optional(),

  email: z.string().email().optional(),
  terms_accepted: z.boolean().optional(),
}).superRefine((val, ctx) => {
  if (val.email && !val.terms_accepted) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Terms must be accepted when email is provided",
      path: ["terms_accepted"],
    });
  }
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = SubmissionCreate.parse(json);

    const created = await prisma.questionSubmission.create({
      data: {
        question: data.question,
        correctAnswer: data.correct_answer,
        wrongAnswerA: data.wrong_answer_a,
        wrongAnswerB: data.wrong_answer_b,
        lat: data.lat,
        lng: data.long,
        email: data.email,
        termsAccepted: data.email ? !!data.terms_accepted : undefined,
        status: "pending",
      },
    });

    return ok({ id: created.id }, { status: 201 });
  } catch (e: any) {
    if (e?.name === "ZodError") return fail("Validation failed", 400, e.flatten());
    return fail("Failed to submit question", 500);
  }
}
