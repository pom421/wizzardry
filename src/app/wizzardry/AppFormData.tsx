import { z } from "zod"
import { homeStepSchema, recruiterStepSchema, workerStepSchema } from "../steps"

export const appFormDataSchema = z.object({
  "home-step": homeStepSchema,
  "recruiter-step": recruiterStepSchema,
  "worker-step": workerStepSchema,
  "confirmation-step": z.object({
    message: z.string(),
  }),
})

export type AppFormData = z.infer<typeof appFormDataSchema>

export const initialAppFormData: AppFormData = {
  "home-step": {
    category: "",
  },
  "recruiter-step": {
    company: "",
    searchedSkill: "",
  },
  "worker-step": {
    name: "",
    favoriteSkill: "",
  },
  "confirmation-step": {
    message: "",
  },
} as const
