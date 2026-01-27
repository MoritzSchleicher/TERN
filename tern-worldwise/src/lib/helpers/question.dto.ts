//mapping questions from db into frontend shape
//dto stands for data transfer object
// lib/dto/question.dto.ts
export function toQuestionDTO(q: {
  id: string;
  question: string;
  answers: unknown;
  correctIndex: number;
  category: string;
  fact: string | null;
  lat: number | null;
  lng: number | null;
  country: string | null;
  status: string;
  createdBy: string;
}) {
  return {
    id: q.id,
    question: q.question,
    answers: q.answers as string[],
    correctIndex: q.correctIndex,
    category: q.category,
    fact: q.fact ?? "",
    location: q.lat != null && q.lng != null
      ? { lat: q.lat, lng: q.lng, country: q.country ?? "" }
      : null,
    status: q.status,
    createdBy: q.createdBy,
  };
}

