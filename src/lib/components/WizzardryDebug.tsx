import dynamic from "next/dynamic"
import { ReactJsonViewProps } from "react-json-view"
import { ClientOnly } from "../../app/components/ClientOnly"
import { FlowStateType } from "../../app/wizzardry/flowState"
import { createUseWizzardryManager, WizzardrySteps } from "../useWizzardryManager"

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false })

const Json = (props: ReactJsonViewProps) => {
  return <DynamicReactJson displayDataTypes={false} enableClipboard={false} {...props} />
}

type Props = {
  wizzardryManager: ReturnType<typeof createUseWizzardryManager>
  flowSteps: WizzardrySteps<FlowStateType>
}

export const WizzardryDebug = ({ wizzardryManager, flowSteps }: Props) => {
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
            <strong>flowSteps</strong>
          </p>

          <Json src={flowSteps.map((step) => ({ label: step.label, ...(step.next && { nextRedirection: "true" }) }))} />
        </div>
      </div>
    </ClientOnly>
  )
}
