import { z } from "zod";

// *────────────────────────────────
// * LEARN: schema.prisma → beschreibt Datenstruktur in der DB.
// * validieren Request-Bodys zur Laufzeit.
// * Damit kann man sicher Daten vom Client annehmen (Typ + Value geprüft)
// * Prisma-Modelle und Zod-Schemas sollten sich semantisch decken
// *────────────────────────────────

export const Category = z.enum(["history","geography","culture","nature"]);
export const CreatedBy = z.enum(["system","user"]);
export const ModerationStatus = z.enum(["approved","pending","rejected"]);

export const QuestionCreate = z.object({
  category: Category,
  question: z.string().min(5).max(300),
  answers: z.array(z.string().min(1).max(120)).min(2).max(6),
  correctIndex: z.number().int().min(0),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    country: z.string().min(2).max(80),
  }),
  fact: z.string().min(10).max(500),
  createdBy: CreatedBy.default("system"),
  status: ModerationStatus.default("pending"),
});

export type QuestionCreateInput = z.infer<typeof QuestionCreate>;
