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
  HISTORY = "Geschichte",
  GEO = "Geografie",
  CULTURE = "Kultur",
  FLORA_FAUNA = "Flora & Fauna"
}

export const QuestionPool: Question[] = [
  {
    id: "q1",
    question: "Wo entstand die erste bekannte Demokratie?",
    answers: ["Athen", "Rom", "Sparta"],
    correctIndex: 0,
    location: { lat: 37.9838, lng: 23.7275, country: "Griechenland" },
    fact: "Im 5. Jh. v. Chr. schufen Athens Volksversammlungen frühe demokratische Strukturen.",
    category: Categories.HISTORY
  },
  {
    id: "q2",
    question: "Welcher US-Präsident war am längsten im Amt?",
    answers: ["Franklin D. Roosevelt", "George Washington", "Abraham Lincoln"],
    correctIndex: 0,
    location: { lat: 38.9072, lng: -77.0369, country: "USA" },
    fact: "F. D. Roosevelt amtierte 1933–45; viermal gewählt, länger als jeder andere US-Präsident.",
    category: Categories.HISTORY
  },
  {
    id: "q3",
    question: "Welches Weltwunder befand sich in Ägypten?",
    answers: ["Leuchtturm von Alexandria", "Hängende Gärten", "Koloss von Rhodos"],
    correctIndex: 0,
    location: { lat: 31.2001, lng: 29.9187, country: "Ägypten" },
    fact: "Der Leuchtturm von Alexandria war eines der sieben Weltwunder.",
    category: Categories.HISTORY
  },
  {
    id: "q4",
    question: "Wie heißt die Reform, die Japans Feudalordnung beendete?",
    answers: ["Meiji-Restauration", "Taika-Reform", "Heisei-Reform"],
    correctIndex: 0,
    location: { lat: 35.6762, lng: 139.6503, country: "Japan" },
    fact: "Ab 1868 modernisierte die Meiji-Restauration Verwaltung, Heer und Wirtschaft.",
    category: Categories.HISTORY
  },
  {
    id: "q5",
    question: "Welche Stadt gilt als Wiege der Renaissance?",
    answers: ["Florenz", "Venedig", "Mailand"],
    correctIndex: 0,
    location: { lat: 43.7699, lng: 11.2556, country: "Italien" },
    fact: "In Florenz förderten die Medici Kunst & Wissenschaft; die Renaissance erblühte.",
    category: Categories.CULTURE
  },
  {
    id: "q6",
    question: "In welchem Land entstand das Inkareich?",
    answers: ["Peru", "Bolivien", "Chile"],
    correctIndex: 0,
    location: { lat: -13.5320, lng: -71.9675, country: "Peru" },
    fact: "Cusco war Zentrum des Reichs bis zur span. Eroberung im 16. Jh.",
    category: Categories.HISTORY
  },
  {
    id: "q7",
    question: "Welche Dynastie prägte den Ausbau der Großen Mauer?",
    answers: ["Ming-Dynastie", "Han-Dynastie", "Qing-Dynastie"],
    correctIndex: 0,
    location: { lat: 40.4319, lng: 116.5704, country: "China" },
    fact: "Die Mauer erhielt im 14.–17. Jh. unter der Ming-Dynastie ihre heutige Form.",
    category: Categories.HISTORY
  },
  {
    id: "q8",
    question: "Welche Stadt zerstörte der Vesuv 79 n. Chr.?",
    answers: ["Pompeji", "Herculaneum", "Neapel"],
    correctIndex: 0,
    location: { lat: 40.7460, lng: 14.4989, country: "Italien" },
    fact: "Pompeji wurde von Asche bedeckt und bewahrt Alltagsbilder der Römer.",
    category: Categories.HISTORY
  },
  // neu – anspruchsvoller Allgemeinwissensfokus
  {
    id: "q9",
    question: "Welcher Fluss durchquert die meisten Staaten?",
    answers: ["Donau", "Nil", "Jangtse"],
    correctIndex: 0,
    location: { lat: 48.2082, lng: 16.3738, country: "Österreich" }, // Wien
    fact: "Die Donau fließt durch 10 Länder und mündet ins Schwarze Meer.",
    category: Categories.GEO
  },
  {
    id: "q10",
    question: "Welche Wüste ist flächenmäßig die größte der Erde?",
    answers: ["Antarktische Wüste", "Sahara", "Arabische Wüste"],
    correctIndex: 0,
    location: { lat: -82.0, lng: 0.0, country: "Antarktis" },
    fact: "Die Antarktis gilt klimatisch als Wüste und ist größer als die Sahara.",
    category: Categories.GEO
  }
]
