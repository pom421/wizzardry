import { WizzardryStep } from "../../lib/useWizzardryManager"
import { ConfirmationStep, HomeStep, RecruiterStep, WorkerStep } from "../steps"

// TODO - the labels of steps must match the keys of the state
export const flowSteps: WizzardryStep[] = [
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
