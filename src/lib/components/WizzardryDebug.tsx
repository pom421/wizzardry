import dynamic from "next/dynamic"
import { ReactJsonViewProps } from "react-json-view"
import { ClientOnly } from "../../app/components/ClientOnly"
import { formSchema } from "../../app/wizzardry/AppFormData"
import { useStepperContext } from "../utils/StepperContext"

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false })

const Json = (props: ReactJsonViewProps) => {
  return <DynamicReactJson displayDataTypes={false} enableClipboard={false} {...props} />
}

export const WizzardryDebug = () => {
  const stepper = useStepperContext<typeof formSchema>()

  console.log("dans debug", stepper.currentStep)

  return (
    <ClientOnly>
      <div style={{ display: "flex", justifyContent: "space-around", paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ minWidth: 300, color: "tomato" }}>
          <p>
            <strong>useFormManager.steps</strong>
          </p>
          <Json
            src={{
              currentStep: stepper.currentStep,
              isFirstStep: stepper.isFirstStep,
              isFinalStep: stepper.isFinalStep,
              visitedSteps: stepper.visitedSteps,
            }}
          />
        </div>
        <div style={{ minWidth: 300, color: "tomato" }}>
          <p>
            <strong>useFormManager.formData</strong>
          </p>

          <Json
            src={{
              visitedFormData: stepper.visitedData,
              data: stepper.data,
            }}
          />
        </div>
        {/* <div style={{ color: "DarkOrange" }}>
          <p>
            <strong>appSteps</strong>
          </p>

          <Json src={appSteps.map((step) => ({ label: step.label, ...(step.next && { nextRedirection: "true" }) }))} />
        </div> */}
      </div>
    </ClientOnly>
  )
}
