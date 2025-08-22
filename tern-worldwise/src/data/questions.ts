// src/data/questions.ts
export type Question = {
    id: string
    question: string
    answers: string[]
    correctIndex: number
    location: { lat: number; lng: number; country: string }
    fact: string
  }
  
  export const demoQuestions: Question[] = [
    {
      id: "q1",
      question: "Wo entstand die erste bekannte Demokratie?",
      answers: ["Athen", "Rom", "Karthago", "Sparta"],
      correctIndex: 0,
      location: { lat: 37.9838, lng: 23.7275, country: "Griechenland" },
      fact: "Im 5. Jh. v. Chr. prägten die athenischen Volksversammlungen wesentliche demokratische Institutionen."
    }
  ]
  