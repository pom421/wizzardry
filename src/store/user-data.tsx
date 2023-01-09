import { z } from "zod"
import { buildStore, UserFlow } from "./useWizardry"

export const myZodSchema = z.object({
  "first-page": z.object({
    category: z.union([z.literal("recruiter"), z.literal("worker"), z.literal("")]),
  }),
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

export const initialData: z.infer<typeof myZodSchema> = {
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

// type MyState = {
//   "form-1": {
//     date: string
//   }
//   "form-2": {
//     category: "recruiter" | "worker"
//   }
//   "recruiter-page": {
//     company: string
//     skills: string[]
//   }
//   "worker-page": {
//     name: string
//     skills: string[]
//   }
//   "last-page": {
//     message: string
//   }
// }

// TODO - the labels of steps must match the keys of the state
export const myFlow: UserFlow<z.infer<typeof myZodSchema>> = {
  initial: "first-page",
  steps: [
    {
      label: "first-page",
      next: (state) => (state["first-page"].category === "recruiter" ? "recruiter-page" : "worker-page"),
    },
    {
      label: "recruiter-page",
      next: () => "last-page",
    },
    {
      label: "worker-page",
    },
    { label: "last-page" },
  ],
  final: "last-page",
}

export const useJobMarketStore = buildStore(initialData)(myFlow)

const DefaultPage = () => {
  return <h1>Default page</h1>
}

const FirstPage = () => {
  return <h1>FirstPage</h1>
}

const RecruiterForm = () => {
  return <h1>RecruiterForm</h1>
}

export const userPages = {
  default: DefaultPage,
  "first-page": FirstPage,
  "recruiter-page": RecruiterForm,
}
