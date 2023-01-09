import { z } from "zod"
import { buildStore, UserFlow } from "./useWizardry"

export const myZodSchema = z.object({
  "first-page": z.object({
    category: z.union([z.literal("recruiter"), z.literal("worker"), z.literal("")]),
  }),
  "recruiter-form": z.object({
    company: z.string().min(1),
    searchedSkill: z.string().min(1),
  }),
  "worker-form": z.object({
    name: z.string(),
    favoriteSkill: z.string().min(1),
  }),
  "last-page": z.object({
    message: z.string(),
  }),
})

export const initialData: z.infer<typeof myZodSchema> = {
  "first-page": {
    category: "",
  },
  "recruiter-form": {
    company: "",
    searchedSkill: "",
  },
  "worker-form": {
    name: "",
    favoriteSkill: "",
  },
  "last-page": {
    message: "",
  },
}

// type MyState = {
//   "form-1": {
//     date: string
//   }
//   "form-2": {
//     category: "recruiter" | "worker"
//   }
//   "recruiter-form": {
//     company: string
//     skills: string[]
//   }
//   "worker-form": {
//     name: string
//     skills: string[]
//   }
//   "last-page": {
//     message: string
//   }
// }

// export const myFlow: WizardryFlow<MyState> = {
export const myFlow: UserFlow<z.infer<typeof myZodSchema>> = {
  initial: "first-page",
  steps: [
    {
      label: "form-1",
    },
    {
      label: "form-2",
      next: (state) => (state["first-page"].category === "recruiter" ? "recruiter-form" : "worker-form"),
    },
    {
      label: "recruiter-form",
      next: () => "last-page",
    },
    {
      label: "worker-form",
    },
  ],
  final: "last-page",
}

export const useJobMarketStore = buildStore(initialData)(myFlow)
