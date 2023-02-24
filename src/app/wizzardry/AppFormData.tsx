import { z } from "zod"
import { buildSteps, Step } from "../../lib/stepper"
import { ConfirmationStep, HomeStep, RecruiterStep, WorkerStep } from "../steps"

export const formSchema = z.object({
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
})

export const initial = {
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

export const steps: Step<z.infer<unknown>>[] = [
  {
    label: "home-step",
    next: (state) => (state["home-step"].category === "recruiter" ? "recruiter-step" : "worker-step"),
    component: HomeStep,
  },
  {
    label: "recruiter-step",
    next: () => "confirmation-step",
    component: RecruiterStep,
  },
  {
    label: "worker-step",
    component: WorkerStep,
  },
  { label: "confirmation-step", component: ConfirmationStep },
] as const

buildSteps(formSchema)({
  initial,
  steps,
})
