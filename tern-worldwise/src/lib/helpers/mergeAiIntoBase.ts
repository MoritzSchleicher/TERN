export function buildBaseFromSubmission(sub: {
  question: string;
  correctAnswer: string;
  wrongAnswerA?: string | null;
  wrongAnswerB?: string | null;
  lat?: number | null;
  lng?: number | null;
}) {
  const answers = [
    sub.correctAnswer,
    sub.wrongAnswerA ?? undefined,
    sub.wrongAnswerB ?? undefined,
  ].filter(Boolean) as string[];

  return {
    question: sub.question,
    // answers/correctIndex nur, wenn wir mind. 2 Antworten haben
    ...(answers.length >= 2 ? { answers, correctIndex: 0 } : {}),
    ...(sub.lat != null ? { lat: sub.lat } : {}),
    ...(sub.lng != null ? { lng: sub.lng } : {}),
  };
}

export function mergeAiIntoBase(base: any, aiPartial: any) {
  // base gewinnt immer, AI füllt nur Lücken
  return {
    category: base.category ?? aiPartial.category,
    question: base.question ?? aiPartial.question,
    answers: base.answers ?? aiPartial.answers,
    correctIndex: base.correctIndex ?? aiPartial.correctIndex,
    lat: base.lat ?? aiPartial.lat,
    lng: base.lng ?? aiPartial.lng,
    country: base.country ?? aiPartial.country,
    fact: base.fact ?? aiPartial.fact,
  };
}
