import { useRouter } from "next/router"
import { useState } from "react"
import { FlowStateType } from "../configFlow/flowState"
import { UserFlow } from "./wizzardry"

export type PositionInFlow = "first" | "middle" | "final"

/**
 * Return a custom hook bound to the flowSteps given.
 *
 * @param flowSteps the user flow steps.
 * @returns a custom hook with helpers.
 */
export const createUseStep = (flowSteps: UserFlow<FlowStateType>) => {
  // Some helpers on flowSteps.
  const normalizeStep = (query: string | string[]) =>
    Array.isArray(query) ? (query.length > 0 ? query[0] : "") : query
  const steps = flowSteps.map((step) => step.label)
  const numberOfSteps = flowSteps.length
  const firstStep = flowSteps[0].label
  const finalStep = flowSteps[flowSteps.length - 1].label
  const getStepIndexOf = (label: string) => flowSteps.findIndex((step) => step.label === label)
  const getStepWithName = (label: string) => flowSteps.find((step) => step.label === label)
  /** Natural next step of the current step, assuming there is no next function */
  const naturalNextStep = (label: string) =>
    getStepWithName(getStepIndexOf(label) < numberOfSteps - 1 ? steps[getStepIndexOf(label) + 1] : finalStep)

  return () => {
    const router = useRouter()
    const rawStep = router.query.step
    const stepLabel = normalizeStep(rawStep)
    const [visitedSteps, setVisitedSteps] = useState<string[]>([])

    const currentStep = getStepWithName(stepLabel)

    // 1. Verify that the step is included in flowSteps.
    if (!currentStep) return {}

    /** Real next step of the current step, using next function if any */
    const realNextStep = (flowState: FlowStateType) =>
      currentStep.next ? getStepWithName(currentStep.next(flowState)) : naturalNextStep(stepLabel)

    return {
      /** Current step showed */
      currentStep,

      /** Previous step of the current step */
      previousStep: getStepWithName(
        // getIndexOfStep(stepLabel) > 0 ? steps[getIndexOfStep(stepLabel) - 1] : firstStep,
        visitedSteps.findIndex((step) => step === stepLabel) > 0
          ? visitedSteps[visitedSteps.findIndex((step) => step === stepLabel) - 1]
          : firstStep,
      ),

      /** Function to call to show the next step */
      goNextStep(flowState: FlowStateType) {
        const nextStep = realNextStep(flowState)
        const indexCurrentStep = visitedSteps.indexOf(stepLabel)

        if (indexCurrentStep === -1) setVisitedSteps([...visitedSteps, stepLabel])
        else {
          // console.log("visitedSteps[indexCurrentStep + 1]", visitedSteps[indexCurrentStep + 1])
          // console.log("nextStep", nextStep)

          if (visitedSteps[indexCurrentStep + 1] !== nextStep.label) {
            setVisitedSteps([...visitedSteps.slice(0, indexCurrentStep)])
          }
        }
        router.push(nextStep.label)
      },

      /** Get if we are in first or last position, for UI needs */
      get positionInFlow() {
        return this.currentStep.label === flowSteps[0]
          ? ("first" as const)
          : this.currentStep.label === flowSteps[flowSteps.length - 1]
          ? "final"
          : "middle"
      },
    }
  }
}
