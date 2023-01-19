import { UserFlow } from "../lib/wizzardry"
import { FinalStep, FirstStep, RecruiterStep, WorkerStep } from "./components"
import type { FlowStateType } from "./flowState"

// TODO - the labels of steps must match the keys of the state
export const flowSteps: UserFlow<FlowStateType> = [
  {
    label: "first-step",
    next: (state) => (state["first-step"].category === "recruiter" ? "recruiter-step" : "worker-step"),
    component: FirstStep,
  },
  {
    label: "recruiter-step",
    next: () => "last-step",
    component: RecruiterStep,
  },
  {
    label: "worker-step",
    component: WorkerStep,
  },
  { label: "last-step", component: FinalStep },
]
