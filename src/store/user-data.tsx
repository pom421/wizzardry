import { z } from "zod"
import { buildStore, UserFlow } from "./useWizardry"

export const myZodSchema = z.object({
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

const DefaultPage = () => {
  return <h1>Default page</h1>
}

const FirstPage = () => {
  return <h1>First Page</h1>
}

const RecruiterPage = () => {
  return <h1>Recruiter Page</h1>
}

const WorkerPage = () => {
  return <h1>Worker Page</h1>
}

const LastPage = () => {
  return <h1>Last Page</h1>
}

// TODO - the labels of steps must match the keys of the state
export const myFlow: UserFlow<z.infer<typeof myZodSchema>> = {
  initial: "first-page",
  steps: [
    {
      label: "first-page",
      next: (state) => (state["first-page"].category === "recruiter" ? "recruiter-page" : "worker-page"),
      component: FirstPage,
    },
    {
      label: "recruiter-page",
      next: () => "last-page",
      component: RecruiterPage,
    },
    {
      label: "worker-page",
      component: WorkerPage,
    },
    { label: "last-page", component: LastPage },
  ],
  final: "last-page",
}

export const useJobMarketStore = buildStore(initialData)(myFlow)

export const userPages = {
  default: DefaultPage,
  "first-page": FirstPage,
  "recruiter-page": RecruiterPage,
  "worker-page": WorkerPage,
  "last-page": LastPage,
}
