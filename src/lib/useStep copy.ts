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
  const normalizeStep = (query: string | string[]) =>
    Array.isArray(query) ? (query.length > 0 ? query[0] : "") : query
  const steps = flowSteps.steps.map((step) => step.label)
  const getStep = (label: string) => flowSteps.steps.find((step) => step.label === label)
  const getIndexOfStep = (label: string) => flowSteps.steps.findIndex((step) => step.label === label)
  const numberOfSteps = flowSteps.steps.length

  return () => {
    const router = useRouter()
    const rawStep = router.query.step
    const stepLabel = normalizeStep(rawStep)
    const [visitedSteps, setVisitedSteps] = useState<string[]>([])

    // 1. Verify that the step is included in flowSteps.
    if (!steps.includes(stepLabel)) return {}

    // 2. Find the component of this step.
    const step = getStep(stepLabel)

    // 3. Caculate the next and previous step.
    const previousStep = getIndexOfStep(stepLabel) > 0 ? steps[getIndexOfStep(stepLabel) - 1] : undefined

    // TODO: Make nextStep a reducer function, which takes state in parameter.
    const nextStep = getIndexOfStep(stepLabel) < numberOfSteps - 1 ? steps[getIndexOfStep(stepLabel) + 1] : undefined

    const goNextStep = () => {
      const indexCurrentStep = visitedSteps.indexOf(stepLabel)

      if (indexCurrentStep === -1) setVisitedSteps([...visitedSteps, stepLabel])
      else {
        // console.log("visitedSteps[indexCurrentStep + 1]", visitedSteps[indexCurrentStep + 1])
        // console.log("nextStep", nextStep)

        if (visitedSteps[indexCurrentStep + 1] !== nextStep) {
          setVisitedSteps([...visitedSteps.slice(0, indexCurrentStep)])
        }
      }
      router.push(nextStep)
    }

    const positionInFlow: PositionInFlow =
      step.label === flowSteps.initial ? ("first" as const) : step.label === flowSteps.final ? "final" : "middle"

    return { step, previousStep, goNextStep, visitedSteps, positionInFlow }
  }
}
