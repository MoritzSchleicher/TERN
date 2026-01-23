import { ZodEmail } from "zod"

export type CSSVar = `var(${string})`

export enum ButtonType {
    SUBMIT = "submit",
    BUTTON = "button"
}

export type SubmitPayload = {
  question: string
  correct_answer: string
  wrong_answer_a?: string
  wrong_answer_b?: string
  lat?: number
  long?: number
  email?: string
  terms_accepted?: boolean
}
