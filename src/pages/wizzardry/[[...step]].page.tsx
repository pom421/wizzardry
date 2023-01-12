import { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import { Actions } from "../../configFlow/components"
import { flowSteps } from "../../configFlow/flowSteps"

const normalizeStep = (query: string | string[]) => (Array.isArray(query) ? (query.length > 0 ? query[0] : "") : query)

const steps = flowSteps.steps.map((step) => step.label)
const getStep = (label: string) => flowSteps.steps.find((step) => step.label === label)
const getIndexOfStep = (label: string) => flowSteps.steps.findIndex((step) => step.label === label)
const numberOfSteps = flowSteps.steps.length

export type Position = "first" | "middle" | "final"

const useStep = (rawStep: string | string[]) => {
  const router = useRouter()
  const [visitedSteps, setVisitedSteps] = useState<string[]>([])
  const stepLabel = normalizeStep(rawStep)

  // 1. Verify that the step is included in flowSteps.
  if (!steps.includes(stepLabel)) return {}

  // 2. Find the component of this step.
  const step = getStep(stepLabel)

  // 3. Caculate the next and previous step.
  const previousStep = getIndexOfStep(stepLabel) > 0 ? steps[getIndexOfStep(stepLabel) - 1] : undefined
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

  const position: Position =
    step.label === flowSteps.initial ? ("first" as const) : step.label === flowSteps.final ? "final" : "middle"

  return { step, previousStep, goNextStep, visitedSteps, position }
}

const WizzardryPage: NextPage = () => {
  const router = useRouter()
  const { step, previousStep, goNextStep, visitedSteps, position } = useStep(router.query.step)

  const stepLabel = step?.label
  const Component = step?.component

  return (
    <>
      <h1>Wizzardry</h1>

      <p>router.query.step: {JSON.stringify(router.query.step, null, 2)}</p>

      <p>step: {stepLabel}</p>

      <p>position: {position}</p>

      <p>visitedSteps: {JSON.stringify(visitedSteps, null, 2)} </p>

      {stepLabel && (
        <>
          <Actions previous={previousStep} goNextStep={goNextStep} position={position} />
          <Component />
        </>
      )}
    </>
  )
}

export default WizzardryPage
