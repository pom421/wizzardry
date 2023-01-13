import { NextPage } from "next"
import { ClientOnly } from "../../components/ClientOnly"
import { Actions } from "../../configFlow/components"
import { flowSteps } from "../../configFlow/flowSteps"
import { useFormManager } from "../../lib/useFormManager"
import { createUseStep } from "../../lib/useStep"

export const useStep = createUseStep(flowSteps)

const WizzardryPage: NextPage = () => {
  const stepInfos = useStep()
  const { step, previousStep, goNextStep, positionInFlow } = stepInfos
  const formData = useFormManager((state) => state.formData)

  const stepLabel = step?.label
  const Component = step?.component

  return (
    <ClientOnly>
      <h1>Wizzardry</h1>

      {stepLabel && (
        <>
          <Actions previous={previousStep} goNextStep={goNextStep} positionInFlow={positionInFlow} />
          <div style={{ minHeight: 300 }}>
            <Component />
          </div>
        </>
      )}

      <div style={{ display: "flex", justifyContent: "start", gap: 200 }}>
        <pre style={{ minWidth: 300, color: "DeepPink" }}>
          <p>
            <strong>useStep</strong>
          </p>
          {JSON.stringify(stepInfos, null, 2)}
        </pre>
        <pre style={{ minWidth: 300, color: "tomato" }}>
          <p>
            <strong>useFormManager</strong>
          </p>
          {JSON.stringify(formData, null, 2)}
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
