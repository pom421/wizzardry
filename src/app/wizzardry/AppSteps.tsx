import { WizzardryStep } from "../../lib/useWizzardryManager"
import { ConfirmationStep, HomeStep, RecruiterStep, WorkerStep } from "../steps"
import { AppFormData } from "./appFormData"

export const appSteps: WizzardryStep<AppFormData>[] = [
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
]
