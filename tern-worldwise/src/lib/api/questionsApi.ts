import { GetRandomParams } from "@/types/question_types";

const BASE_URL = "/api/questions";

/*
╔═════════════════════════════════════════════════════════════════════════════╗
║                                                                             ║
║                               QUESTIONS                                     ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝
*/
// *────────────────────────────────
// * LEARN: Fetch-Aufrufe lesbar und zentral wartbar machen
// *────────────────────────────────
export async function getAllQuestions() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getQuestionById(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function get_random_questions(params: GetRandomParams = {}) {
  const url = new URL("/api/questions/random", window.location.origin);

  if (params.limit !== undefined){
    url.searchParams.set("limit", String(params.limit));
  } 

  const response = await fetch(url.toString(), { method: "GET" });
  if (!response.ok){
    throw new Error(`get random question failed: ${response.status}`);
  } 

  const data = await response.json();
  return { data }; 
}

export async function createQuestion(payload: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateQuestion(id: string, payload: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteQuestion(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
