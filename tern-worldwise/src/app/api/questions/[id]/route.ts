export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { QuestionCreate } from "@/lib/schemas/question.schema";
import { fail, ok } from "../../utils/response";

// *────────────────────────────────
// * LEARN: React (Frontend) sollte nie direkt mit Prisma sprechen.
// *    → Stattdessen: API-Routen als "Schnittstelle" (Next.js App Router).
// *    → Vorteil: Sicherheit, Validation, klare Statuscodes, Skalierbarkeit.
// * 
// *────────────────────────────────

const Id = z.object({ id: z.string().min(1) });
const QuestionPatch = QuestionCreate.partial(); 

export async function GET(_: NextRequest, ctx: { params: { id: string } }) {
  try {
    const { id } = Id.parse(ctx.params);
    const item = await prisma.question.findUnique({ where: { id } });
    if (!item) return fail("Not found", 404);
    return ok(item);
  } catch {
    return fail("Failed to fetch question", 500);
  }
}

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const { id } = Id.parse(ctx.params);
    const json = await req.json();
    const data = QuestionPatch.parse(json);

    if (data.correctIndex !== undefined && data.answers) {
      if (data.correctIndex >= data.answers.length) {
        return fail("correctIndex out of range", 400);
      }
    }

    const updated = await prisma.question.update({
      where: { id },
      data: {
        ...("category" in data ? { category: data.category } : {}),
        ...("question" in data ? { question: data.question } : {}),
        ...("answers" in data ? { answers: data.answers } : {}),
        ...("correctIndex" in data ? { correctIndex: data.correctIndex } : {}),
        ...("fact" in data ? { fact: data.fact } : {}),
        ...("createdBy" in data ? { createdBy: data.createdBy } : {}),
        ...("status" in data ? { status: data.status } : {}),
        ...(data.location
          ? { lat: data.location.lat, lng: data.location.lng, country: data.location.country }
          : {}),
      },
    });

    return ok(updated);
  } catch (e: any) {
    if (e?.code === "P2025") return fail("Not found", 404);
    if (e?.name === "ZodError") return fail("Validation failed", 400, e.flatten());
    return fail("Failed to update question", 500);
  }
}

export async function DELETE(_: NextRequest, ctx: { params: { id: string } }) {
  try {
    const { id } = Id.parse(ctx.params);
    await prisma.question.delete({ where: { id } });
    return ok({ id });
  } catch (e: any) {
    if (e?.code === "P2025") return fail("Not found", 404);
    return fail("Failed to delete question", 500);
  }
}
