import { z, ZodIssueCode } from "zod";

export const AiQuestionPartialSchema = z.object({
  category: z.enum(["history", "geography", "culture", "nature"]).optional(),
  question: z.string().min(5).max(200).optional(),
  answers: z.array(z.string().min(1).max(120)).min(2).max(6).optional(),
  correctIndex: z.number().int().min(0).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  country: z.string().min(2).max(80).optional(),
  fact: z.string().min(10).max(400).optional(),
});

export const AiQuestionSchema = z.object({
  category: z.enum(["history", "geography", "culture", "nature"]),
  question: z.string().min(5).max(200),
  answers: z.array(z.string().min(1).max(120)).min(2).max(6),
  correctIndex: z.number().int().min(0),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  country: z.string().min(2).max(80),
  fact: z.string().min(10).max(400),
}).superRefine((val, ctx) => {
  if (val.correctIndex >= val.answers.length) {
    ctx.addIssue({ code: ZodIssueCode.custom, message: "correctIndex out of range", path: ["correctIndex"] });
  }
  const norm = val.answers.map(a => a.trim().toLowerCase());
  if (new Set(norm).size !== norm.length) {
    ctx.addIssue({ code: ZodIssueCode.custom, message: "answers contain duplicates", path: ["answers"] });
  }
});


export type AiQuestion = z.infer<typeof AiQuestionSchema>;
