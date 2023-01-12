import { z } from "zod"
import { firstStepSchema, recruiterStepSchema } from "./components"

export const flowStateSchema = z.object({
  "first-step": firstStepSchema,
  "recruiter-step": recruiterStepSchema,
  "worker-step": z.object({
    name: z.string(),
    favoriteSkill: z.string().min(1),
  }),
  "last-step": z.object({
    message: z.string(),
  }),
})

export type FlowStateType = z.infer<typeof flowStateSchema>

export const initialFlowStateData: FlowStateType = {
  "first-step": {
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
  "last-step": {
    message: "",
  },
}
