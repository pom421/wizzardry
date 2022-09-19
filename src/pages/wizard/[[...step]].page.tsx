import { useMachine } from "@xstate/react"
import type { NextPage } from "next"
import { Form1 } from "../../components/forms/Form1"
import { Form2 } from "../../components/forms/Form2"
import { FormEnd } from "../../components/forms/FormEnd"

import { declarationMachine } from "../../machines/wizardMachine"

export async function getServerSideProps({ query }) {
  const { step } = query

  return {
    props: {
      step,
    },
  }
}

// const EGAPRO_STEPS = ["page1", "page2", "page3", "page4"]

const EGAPRO_STEPS = [Form1, Form2, FormEnd]

const WizardPage: NextPage = ({ step }: { step: string[] }) => {
  const index = EGAPRO_STEPS.map((form) => form.label).indexOf(step[0])

  const normalizedStep = index >= 0 ? EGAPRO_STEPS[index] : EGAPRO_STEPS[0]

  const [state, send] = useMachine(declarationMachine, {
    context: {
      currentStep: normalizedStep,
      allSteps: EGAPRO_STEPS,
    },
  })

  const { currentStep: CurrentForm } = state.context

  return (
    <>
      <h1>Dans wizard {step}</h1>
      <div>
        {JSON.stringify(state.value)} <br />
        {JSON.stringify(state.context)}
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
