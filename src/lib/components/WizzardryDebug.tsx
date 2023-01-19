import dynamic from "next/dynamic"
import { ClientOnly } from "../../components/ClientOnly"
import { FlowStateType } from "../../configFlow/flowState"
import { createUseWizzardryManager } from "../useWizzardryManager"
import { UserFlow } from "../wizzardry"

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false })

type Props = {
  wizzardryManager: ReturnType<typeof createUseWizzardryManager>
  flowSteps: UserFlow<FlowStateType>
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
          <DynamicReactJson
            displayDataTypes={false}
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

          <DynamicReactJson
            displayDataTypes={false}
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

          <DynamicReactJson
            displayDataTypes={false}
            src={flowSteps.map((step) => ({ label: step.label, ...(step.next && { redirection: "true" }) }))}
          />
        </div>
      </div>
    </ClientOnly>
  )
}
