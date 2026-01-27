export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "../utils/response";
import { z } from "zod";

function parsePagination(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const take = Math.min(50, Math.max(1, Number(searchParams.get("take") ?? 20)));

  const status = searchParams.get("status") as
  | "pending"
  | "processing"
  | "accepted"
  | "rejected"
  | undefined;


  const q = searchParams.get("q")?.trim();

  const where: any = {};
  if (status) where.status = status;

  if (q) {
    where.OR = [
      { question: { contains: q, mode: "insensitive" } },
      { correctAnswer: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }

  return { page, take, where };
}

export async function GET(req: NextRequest) {
  try {
    const { page, take, where } = parsePagination(req);

    const [items, total] = await Promise.all([
      prisma.questionSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip: (page - 1) * take,
      }),
      prisma.questionSubmission.count({ where }),
    ]);

    return ok({
      items,
      page,
      take,
      total,
      pages: Math.ceil(total / take),
    });
  } catch (e) {
    return fail("Failed to fetch submissions", 500);
  }
}
