// app/api/questions/random/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CreatedBy, ModerationStatus, QuestionCreate } from "@/lib/schemas/question.schema";
import { toQuestionDTO } from "@/lib/dto/question.dto";


/**
 * Response-Schema für bestehende Fragen:
 * - basiert auf QuestionCreate (weil das dein Shape inkl. location ist)
 * - ergänzt um id, status, createdBy
 */
const QuestionDTO = QuestionCreate.extend({
  id: z.string(),
  status: ModerationStatus,
  createdBy: CreatedBy,
});
const QuestionsResponse = z.array(QuestionDTO);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawLimit = Number(searchParams.get("limit") ?? 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 10;

  // Holen: Zufällig per Postgres RANDOM()
  // Achtung: DB hat flache Spalten (lat/lng/country) → später in location mappen.
  const rows = await prisma.$queryRaw<
    Array<{
      id: string;
      question: string;
      answers: unknown; // jsonb → any[]
      correctIndex: number;
      category: string;
      fact: string | null;
      lat: number | null;
      lng: number | null;
      country: string | null;
      status: string;     // enum in DB
      createdBy: string;  // enum in DB
    }>
  >`
    SELECT id, question, answers, "correctIndex", category, fact, lat, lng, country, status, "createdBy"
    FROM "Question"
    WHERE status='approved' AND lat IS NOT NULL AND lng IS NOT NULL
    ORDER BY RANDOM()
    LIMIT ${limit};
  `;

  // In dein Frontend-Shape mappen (location-Objekt)…
  const mapped = rows.map(toQuestionDTO);

  // …und mit Zod absichern (wirft 400, falls was nicht passt)
  try {
    const data = QuestionsResponse.parse(mapped);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Validation error in /api/questions/random:", err);
    return NextResponse.json(
      { error: "Invalid data shape", details: (err as Error).message },
      { status: 500 },
    );
  }
}
