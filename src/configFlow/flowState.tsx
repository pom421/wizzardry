import { z } from "zod"

export const flowStateSchema = z.object({
  "first-page": z
    .object({
      category: z.union([z.literal("recruiter"), z.literal("worker"), z.literal("")]),
    })
    .describe("First page"),
  "recruiter-page": z.object({
    company: z.string().min(1),
    searchedSkill: z.string().min(1),
  }),
  "worker-page": z.object({
    name: z.string(),
    favoriteSkill: z.string().min(1),
  }),
  "last-page": z.object({
    message: z.string(),
  }),
})

export type FlowStateType = z.infer<typeof flowStateSchema>

export const initialData: FlowStateType = {
  "first-page": {
    category: "",
  },
  "recruiter-page": {
    company: "",
    searchedSkill: "",
  },
  "worker-page": {
    name: "",
    favoriteSkill: "",
  },
  "last-page": {
    message: "",
  },
}
