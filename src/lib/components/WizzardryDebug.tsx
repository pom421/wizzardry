import dynamic from "next/dynamic"
import { ReactJsonViewProps } from "react-json-view"
import { ClientOnly } from "../../app/components/ClientOnly"
import { createUseWizzardryManager, WizzardryFormData, WizzardryStep } from "../useWizzardryManager"

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false })

const Json = (props: ReactJsonViewProps) => {
  return <DynamicReactJson displayDataTypes={false} enableClipboard={false} {...props} />
}

type Props<FormData extends WizzardryFormData> = {
  wizzardryManager: ReturnType<typeof createUseWizzardryManager>
  appSteps: WizzardryStep<FormData>[]
}

export const WizzardryDebug = <FormData extends WizzardryFormData>({ wizzardryManager, appSteps }: Props<FormData>) => {
  const wizzardryState = wizzardryManager()

  const { currentStep, visitedSteps, visitedFormData, formData, isFirstStep, isFinalStep } = wizzardryState

  return (
    <ClientOnly>
      <div style={{ display: "flex", justifyContent: "space-around", paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ minWidth: 300, color: "tomato" }}>
          <p>
            <strong>useFormManager.steps</strong>
          </p>
          <Json
            src={{
              currentStep,
              isFirstStep: isFirstStep(),
              isFinalStep: isFinalStep(),
              visitedSteps,
            }}
          />
        </div>
        <div style={{ minWidth: 300, color: "tomato" }}>
          <p>
            <strong>useFormManager.formData</strong>
          </p>

          <Json
            src={{
              visitedFormData,
              ...formData,
            }}
          />
        </div>
        <div style={{ color: "DarkOrange" }}>
          <p>
            <strong>appSteps</strong>
          </p>

          <Json src={appSteps.map((step) => ({ label: step.label, ...(step.next && { nextRedirection: "true" }) }))} />
        </div>
      </div>
    </ClientOnly>
  )
}
