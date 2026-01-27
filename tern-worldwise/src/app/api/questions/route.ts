export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "../utils/response";
import { QuestionCreate } from "@/lib/schemas/question.schema";
import { toQuestionDTO } from "@/lib/helpers/question.dto";

// *────────────────────────────────
// * LEARN: liest Query-Parameter & baut Prisma-kompatibles where-Objekt
// * um Datensätze performant auszuliefern (Feed, Listen, Scrollen).
// * → Standard in REST-APIs
// * "page" & "take" sind KEINE DB-Seiten, sondern Pagination-Parameter.
// *    → "page" = welche Seite will ich?
// *    → "take" = wie viele Einträge pro Seite?
// *────────────────────────────────
function parsePagination(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const take = Math.min(50, Math.max(1, Number(searchParams.get("take") ?? 20)));
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category") as
    | "history" | "geography" | "culture" | "nature" | undefined;
  const status = searchParams.get("status") as
    | "approved" | "pending" | "rejected" | undefined;

  const where: any = {};
  if (q) {
    where.OR = [
      { question: { contains: q, mode: "insensitive" } },
      { fact: { contains: q, mode: "insensitive" } },
      { country: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) where.category = category;
  if (status) where.status = status;

  return { page, take, where };
}

export async function GET(req: NextRequest) {
  try {
    const { page, take, where } = parsePagination(req);

    const [items, total] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip: (page - 1) * take,
      }),
      prisma.question.count({ where }),
    ]);

    const itemsDto = items.map(toQuestionDTO);

    return ok({
      items: itemsDto,
      page,
      take,
      total,
      pages: Math.ceil(total / take),
    });
  } catch (e) {
    return fail("Failed to fetch questions", 500);
  }
}


export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = QuestionCreate.parse(json);

    if (data.correctIndex >= data.answers.length) {
      return fail("correctIndex out of range", 400);
    }

    const created = await prisma.question.create({
      data: {
        category: data.category,
        question: data.question,
        answers: data.answers,
        correctIndex: data.correctIndex,
        lat: data.location.lat,
        lng: data.location.lng,
        country: data.location.country,
        fact: data.fact,
        createdBy: data.createdBy,
        status: data.status,
      },
    });

    return ok(toQuestionDTO(created), { status: 201 });
  } catch (e: any) {
    if (e?.name === "ZodError") return fail("Validation failed", 400, e.flatten());
    return fail("Failed to create question", 500);
  }
}
