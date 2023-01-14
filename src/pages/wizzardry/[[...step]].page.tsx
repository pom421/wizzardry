import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { ClientOnly } from "../../components/ClientOnly"
import { Actions } from "../../configFlow/components"
import { flowSteps } from "../../configFlow/flowSteps"
import { createFlowStepsHelpers, createUseWizzardryManager } from "../../lib/useWizzardryManager"

export const flowStepsHelpers = createFlowStepsHelpers(flowSteps)
const { getStepWithName } = flowStepsHelpers
export const useWizzardryManager = createUseWizzardryManager(flowStepsHelpers)

const getStepInUrl = (path: string) => {
  const [, step] = path.split("/").filter(Boolean)
  return step
}
const WizzardryPage: NextPage = () => {
  const router = useRouter()
  const formData = useWizzardryManager((state) => state.formData)
  const currentStep = useWizzardryManager((state) => state.currentStep)
  const visitedSteps = useWizzardryManager((state) => state.visitedSteps)

  const Component = getStepWithName(currentStep)?.component

  // Sync the URL with the current step.
  useEffect(() => {
    const stepInUrl = getStepInUrl(router.asPath)
    if (currentStep !== stepInUrl && !visitedSteps.includes(stepInUrl)) {
      router.push(currentStep, undefined, { shallow: true })
    }
  }, [router.asPath, currentStep, router, visitedSteps])

  return (
    <ClientOnly>
      <h1>Wizzardry</h1>

      {currentStep && (
        <>
          <Actions />
          <div style={{ minHeight: 300 }}>
            <>
              <Component />
            </>
          </div>
        </>
      )}

      <div style={{ display: "flex", justifyContent: "start", gap: 200 }}>
        <pre style={{ minWidth: 300, color: "tomato" }}>
          <p>
            <strong>useFormManager</strong>
          </p>
          {JSON.stringify({ currentStep, visitedSteps, ...formData }, null, 2)}
        </pre>
        <pre style={{ color: "DarkOrange" }}>
          <p>
            <strong>flowSteps</strong>
          </p>
          {JSON.stringify(flowSteps, null, 2)}
        </pre>
      </div>

      <hr />
    </ClientOnly>
  )
}

export default WizzardryPage
