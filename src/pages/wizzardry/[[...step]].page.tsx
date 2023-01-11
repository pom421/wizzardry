import { NextPage } from "next"
import { useRouter } from "next/router"
import { Actions } from "../../configFlow/components"
import { flowSteps } from "../../configFlow/flowSteps"

const normalizeStep = (query: string | string[]) => (Array.isArray(query) ? (query.length > 0 ? query[0] : "") : query)

const steps = flowSteps.steps.map((step) => step.label)
const getStep = (label: string) => flowSteps.steps.find((step) => step.label === label)
const getIndexOfStep = (label: string) => flowSteps.steps.findIndex((step) => step.label === label)
const numberOfSteps = flowSteps.steps.length

const useStep = (rawStep: string | string[]) => {
  const stepLabel = normalizeStep(rawStep)

  // 1. Verify that the step is included in flowSteps.
  if (!steps.includes(stepLabel)) return {}

  // 2. Find the component of this step.
  const step = getStep(stepLabel)
  const Component = step.component

  // 3. Caculate the next and previous step.
  const previousStep = getIndexOfStep(stepLabel) > 0 ? steps[getIndexOfStep(stepLabel) - 1] : undefined
  const nextStep = getIndexOfStep(stepLabel) < numberOfSteps - 1 ? steps[getIndexOfStep(stepLabel) + 1] : undefined

  return { stepLabel, Component, previousStep, nextStep }
}

const WizzardryPage: NextPage = () => {
  const router = useRouter()
  const { step: rawStep } = router.query
  const { stepLabel, Component, previousStep, nextStep } = useStep(rawStep)

  return (
    <>
      <h1>Wizzardry</h1>

      <p>rawStep: {JSON.stringify(rawStep, null, 2)}</p>

      <p>step: {stepLabel}</p>

      {stepLabel && (
        <>
          <Component />
          <Actions previous={previousStep} next={nextStep} />
        </>
      )}
    </>
  )
}

export default WizzardryPage
