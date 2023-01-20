import { z } from "zod"
import { WizzardryFormData } from "../../lib/useWizzardryManager"
import { homeStepSchema, recruiterStepSchema, workerStepSchema } from "../steps"

export const flowStateSchema = z.object({
  "home-step": homeStepSchema,
  "recruiter-step": recruiterStepSchema,
  "worker-step": workerStepSchema,
  "confirmation-step": z.object({
    message: z.string(),
  }),
})

export type FlowStateType = z.infer<typeof flowStateSchema>

export const initialFlowStateData: WizzardryFormData = {
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
} satisfies FlowStateType
