import OpenAI from "openai";
import { AiQuestionPartialJsonSchema } from "./aiQuestionPartial.schema.json";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type SubmissionForAI = {
  question: string;
  correctAnswer: string;
  wrongAnswerA?: string | null;
  wrongAnswerB?: string | null;
  lat?: number | null;
  lng?: number | null;
  email?: string | null;
};

export async function aiFillSubmission(
  submission: SubmissionForAI,
  base: Record<string, unknown>
) {
    if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
    console.log("OpenAI key loaded:", process.env.OPENAI_API_KEY.slice(0, 7) + "...");


    const systemPrompt = `
        You are an assistant that enriches quiz questions.
        IMPORTANT RULES:
        - Fill ONLY missing fields
        - NEVER overwrite provided fields
        - NEVER correct latitude or longitude if already present
        - Return ONLY valid JSON matching the schema
        - Keep answers short, unique, and plausible
    `;

    const userPayload = {
        submission,
        alreadyKnown: base,
        instruction: "Fill missing fields only.",
    };

    const response = await (openai.responses.create as any)({
        model: "gpt-4.1-mini",
        max_output_tokens: 600,
        input: [
            { role: "system", content: systemPrompt },
            { role: "user", content: JSON.stringify(userPayload) },
        ],
        text: {
            format: {
                type: "json_schema",
                name: "AiQuestionPartial",
                schema: AiQuestionPartialJsonSchema,
                strict: true,
            },
        },

    });

    const text = response.output_text;
    console.log("AI raw output_text:", text);

    try {
        return JSON.parse(text);
    } catch {
        throw new Error("AI returned non-JSON or empty output_text");
    }

}
