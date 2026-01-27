import { z } from "zod";

export const SubmissionCreate = z.object({
  question: z.string().min(1).max(300),
  correct_answer: z.string().min(1).max(200),

  wrong_answer_a: z.string().min(1).max(200).optional(),
  wrong_answer_b: z.string().min(1).max(200).optional(),

  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),

  email: z.string().email().optional(),
  terms_accepted: z.boolean().optional(),
}).superRefine((val, ctx) => {
  // Wenn Email angegeben, müssen Terms akzeptiert sein
  if (val.email && !val.terms_accepted) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Terms must be accepted when email is provided",
      path: ["terms_accepted"],
    });
  }
});
