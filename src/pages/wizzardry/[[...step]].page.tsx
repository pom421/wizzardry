import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { mountStoreDevtool } from "simple-zustand-devtools"
import { ClientOnly } from "../../app/components/ClientOnly"
import { Actions } from "../../app/steps"
import { initialAppFormData } from "../../app/wizzardry/appFormData"
import { appSteps } from "../../app/wizzardry/appSteps"
import { WizzardryDebug } from "../../lib/components/WizzardryDebug"
import { createFlowStepsHelpers, createUseWizzardryManager } from "../../lib/useWizzardryManager"

export const flowStepsHelpers = createFlowStepsHelpers(appSteps)
const { getStepWithName } = flowStepsHelpers
export const useWizzardryManager = createUseWizzardryManager(flowStepsHelpers, initialAppFormData)

const getStepInUrl = (path: string) => {
  const [, step] = path.split("/").filter(Boolean)
  return step
}
const WizzardryPage: NextPage = () => {
  const router = useRouter()
  const currentStep = useWizzardryManager((state) => state.currentStep)
  const visitedSteps = useWizzardryManager((state) => state.visitedSteps)

  const Component = getStepWithName(currentStep)?.component

  // Sync the URL with the current step.
  useEffect(() => {
    const stepInUrl = getStepInUrl(router.asPath)
    if (stepInUrl && currentStep !== stepInUrl && !visitedSteps.includes(stepInUrl)) {
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

      <WizzardryDebug wizzardryManager={useWizzardryManager} flowSteps={appSteps} />
      <hr />
    </ClientOnly>
  )
}

export default WizzardryPage

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("useWizzardryManager", useWizzardryManager)
}
