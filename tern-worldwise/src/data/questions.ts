// src/data/questions.ts
export type Question = {
  id: string
  question: string
  answers: string[]
  correctIndex: number
  location: { lat: number; lng: number; country: string }
  fact: string,
  category: Categories
}

export enum Categories {
  HISTORY = "Geschichte"
}

export const QuestionPool: Question[] = [
  {
    id: "q1",
    question: "Wo entstand die erste bekannte Demokratie?",
    answers: ["Athen", "Rom", "Sparta"],
    correctIndex: 0,
    location: { lat: 37.9838, lng: 23.7275, country: "Griechenland" },
    fact: "Im 5. Jh. v. Chr. prägten die athenischen Volksversammlungen wesentliche demokratische Institutionen.",
    category: Categories.HISTORY
  },
  {
    id: "q2",
    question: "Welcher US-Präsident war am längsten im Amt?",
    answers: ["Franklin D. Roosevelt", "George Washington", "Abraham Lincoln"],
    correctIndex: 0,
    location: { lat: 38.9072, lng: -77.0369, country: "USA" }, // Washington D.C.
    fact: "Franklin D. Roosevelt war von 1933 bis 1945 viermal gewählt und damit der am längsten amtierende US-Präsident.",
    category: Categories.HISTORY
  },
  {
    id: "q3",
    question: "Welches Weltwunder befand sich in Ägypten?",
    answers: ["Leuchtturm von Alexandria", "Hängende Gärten", "Koloss von Rhodos"],
    correctIndex: 0,
    location: { lat: 31.2001, lng: 29.9187, country: "Ägypten" }, // Alexandria
    fact: "Der Leuchtturm von Alexandria galt als eines der Sieben Weltwunder der Antike.",
    category: Categories.HISTORY
  },
  {
    id: "q4",
    question: "Welcher asiatische Staat war jahrhundertelang unter dem Einfluss der Samurai-Krieger?",
    answers: ["Japan", "China", "Korea"],
    correctIndex: 0,
    location: { lat: 35.6762, lng: 139.6503, country: "Japan" }, // Tokio
    fact: "Die Samurai dominierten Japans Gesellschaft und Politik bis zur Meiji-Restauration im 19. Jahrhundert.",
    category: Categories.HISTORY
  },
  {
    id: "q5",
    question: "Welche Stadt gilt als Wiege der Renaissance?",
    answers: ["Florenz", "Venedig", "Mailand"],
    correctIndex: 0,
    location: { lat: 43.7699, lng: 11.2556, country: "Italien" },
    fact: "In Florenz förderten Familien wie die Medici Kunst und Wissenschaft, wodurch die Renaissance erblühte.",
    category: Categories.HISTORY
  },
  {
    id: "q6",
    question: "In welchem Land wurde die Inka-Zivilisation gegründet?",
    answers: ["Peru", "Bolivien", "Chile"],
    correctIndex: 0,
    location: { lat: -13.5320, lng: -71.9675, country: "Peru" }, // Cusco
    fact: "Cusco war das Zentrum des Inkareiches, das bis zur spanischen Eroberung im 16. Jahrhundert existierte.",
    category: Categories.HISTORY
  },
  {
    id: "q7",
    question: "Welcher berühmte chinesische Bau ist über 20.000 km lang?",
    answers: ["Chinesische Mauer", "Verbotene Stadt", "Sommerpalast"],
    correctIndex: 0,
    location: { lat: 40.4319, lng: 116.5704, country: "China" },
    fact: "Die Chinesische Mauer wurde über Jahrhunderte gebaut, um das Reich gegen Invasionen aus dem Norden zu schützen.",
    category: Categories.HISTORY
  },
  {
    id: "q8",
    question: "Welche Stadt wurde 79 n. Chr. durch den Ausbruch des Vesuv zerstört?",
    answers: ["Pompeji", "Herculaneum", "Neapel"],
    correctIndex: 0,
    location: { lat: 40.7460, lng: 14.4989, country: "Italien" },
    fact: "Pompeji wurde unter einer dicken Ascheschicht begraben und gibt heute Einblicke in das Leben der Römer.",
    category: Categories.HISTORY
  }
]
