export const AiQuestionPartialJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "category",
    "question",
    "answers",
    "correctIndex",
    "lat",
    "lng",
    "country",
    "fact",
  ],
  properties: {
    category: {
      type: ["string", "null"],
      enum: ["history", "geography", "culture", "nature", null],
    },
    question: { type: ["string", "null"], minLength: 5, maxLength: 200 },
    answers: {
      type: ["array", "null"],
      items: { type: "string", minLength: 1, maxLength: 120 },
      minItems: 2,
      maxItems: 6,
    },
    correctIndex: { type: ["integer", "null"], minimum: 0 },
    lat: { type: ["number", "null"], minimum: -90, maximum: 90 },
    lng: { type: ["number", "null"], minimum: -180, maximum: 180 },
    country: { type: ["string", "null"], minLength: 2, maxLength: 80 },
    fact: { type: ["string", "null"], minLength: 10, maxLength: 400 },
  },
} as const;
