export type GetRandomParams = { 
  limit?: number 
};

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
  HISTORY = "history",
  GEO = "geography",
  CULTURE = "culture",
  NATURE = "nature"
}