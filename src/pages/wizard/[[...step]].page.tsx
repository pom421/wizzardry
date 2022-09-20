import { useMachine } from "@xstate/react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { Form1 } from "../../components/forms/Form1"
import { Form2 } from "../../components/forms/Form2"
import { FormEnd } from "../../components/forms/FormEnd"

import { declarationMachine, WizardryContext } from "../../machines/wizardMachine"

const EGAPRO_STEPS = [Form1, Form2, FormEnd]

type Props = {
  children: React.ReactNode
}

// const ClientOnly: React.FC<Props> = ({ children }) => {
//   const [isMounted, setMounted] = React.useState(false)

//   React.useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!isMounted) return null

//   return <>{children}</>
// }

const WizardPage: NextPage = () => {
  const router = useRouter()

  const { step } = router.query

  console.log("query", step)

  const normalizedStep = Array.isArray(step) && step.length > 0 ? step[0] : undefined

  return <Wizard step={normalizedStep} />
}

type WizardProps = {
  step: string | undefined
}

// Show context with meaningful values.
const DebugContext = ({ state }) => {
  const context: WizardryContext = state.context

  const res = {
    ...context,
    currentStep: context?.currentStep.label,
    allSteps: context?.allSteps.map((step) => step.label),
  }

  return <pre>{JSON.stringify(res, null, 2)}</pre>
}

const Wizard: React.FC<WizardProps> = ({ step }) => {
  const index = EGAPRO_STEPS.map((form) => form.label).indexOf(step)

  const normalizedStep = index >= 0 ? EGAPRO_STEPS[index] : EGAPRO_STEPS[0]

  console.log("normalizedStep", normalizedStep.label)

  const [state, send] = useMachine(declarationMachine, {
    context: {
      currentStep: normalizedStep,
      allSteps: EGAPRO_STEPS,
    },
  })

  const { currentStep: CurrentForm } = state.context

  React.useEffect(() => {
    if (CurrentForm.label !== step) {
      // todo: essayer de router dans la machine au step demandé
      send({
        type: "goToPage",
        step,
      })
    }
  }, [step, CurrentForm.label, send])

  console.log("currentStep", CurrentForm.label)

  return (
    <>
      <h1>Dans wizard {step}</h1>
      <div>
        {JSON.stringify(state.value)} <br />
        <DebugContext state={state} />
        <br />
        <CurrentForm>
          <button
            onClick={() => {
              send("goToPreviousPage")
            }}
          >
            Previous
          </button>
          <button
            onClick={() => {
              send("goToNextPage")
            }}
          >
            Next
          </button>
        </CurrentForm>
      </div>
    </>
  )
}

export default WizardPage
