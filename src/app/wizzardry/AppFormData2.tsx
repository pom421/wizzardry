import { z } from "zod"

export const formDataSchema = {
  "home-step": z.object({
    category: z.union([z.literal("recruiter"), z.literal("worker"), z.literal("")]),
  }),
  "recruiter-step": z.object({
    company: z.string().min(1),
    searchedSkill: z.string().min(1),
  }),
  "worker-step": z.object({
    name: z.string().min(1),
    favoriteSkill: z.string().min(1),
  }),
  "confirmation-step": z.object({
    message: z.string(),
  }),
}

const allSchemas = z.object(formDataSchema)

export type AppFormData = z.infer<typeof allSchemas>

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
