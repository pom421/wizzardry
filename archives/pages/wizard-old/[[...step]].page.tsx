import { useMachine } from "@xstate/react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"

import type { WizardryContext } from "../../machines/wizardMachine"

import { Form1 } from "../../components/forms/Form1"
import { Form2 } from "../../components/forms/Form2"
import { FormEnd } from "../../components/forms/FormEnd"
import { declarationMachine } from "../../machines/wizardMachine"

const EGAPRO_STEPS = [Form1, Form2, FormEnd]

const getStepFromLabel = (label: string) => {
  const index = EGAPRO_STEPS.map((form) => form.label).indexOf(label)

  if (index >= 0) return EGAPRO_STEPS[index]
  else {
    console.error(`Le label ${label} doesn't exist for the steps.`)
    return EGAPRO_STEPS[0]
  }
}

const WizardPage: NextPage = () => {
  const router = useRouter()

  const { step } = router.query

  const normalizedStep = Array.isArray(step) && step.length > 0 ? step[0] : undefined

  return <Wizard step={normalizedStep} />
}

// Show context with meaningful values.
const DebugContext = ({ state }) => {
  const context: WizardryContext = state.context

  const res = {
    ...context,
    currentStep: context?.currentStepLabel,
    allSteps: context?.allSteps.map((step) => step.label),
  }

  return <pre>{JSON.stringify(res, null, 2)}</pre>
}

type WizardProps = {
  step: string | undefined
}

const Wizard: React.FC<WizardProps> = ({ step }) => {
  const [state, send] = useMachine(declarationMachine, {
    context: {
      allSteps: EGAPRO_STEPS,
    },
  })

  const CurrentForm = getStepFromLabel(state?.context?.currentStepLabel)

  // Synchronization between URL and current step.
  React.useEffect(() => {
    if (step && EGAPRO_STEPS.map((step) => step.label).includes(step) && CurrentForm.label !== step) {
      // todo: essayer de router dans la machine au step demandé

      console.log("avant send", step)

      send({
        type: "goToPage",
        step,
      })
    }
  }, [step, CurrentForm.label, send])

  // console.log("currentStep", CurrentForm.label)

  return (
    <>
      <h1>Dans wizard {step}</h1>
      <div>
        {JSON.stringify(step)} <br />
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
