import { useMachine } from "@xstate/react"
import type { NextPage } from "next"

import { declarationMachine } from "../../machines/wizardMachine"

export async function getServerSideProps({ query }) {
  const { step } = query

  return {
    props: {
      step,
    },
  }
}

const EGAPRO_STEPS = ["page1", "page2", "page3", "page4"]

const WizardPage: NextPage = ({ step }: { step: string[] }) => {
  const normalizedStep = EGAPRO_STEPS.indexOf(step[0]) >= 0 ? step[0] : EGAPRO_STEPS[0]

  const [state, send] = useMachine(declarationMachine, {
    context: {
      currentStep: normalizedStep,
      allSteps: EGAPRO_STEPS,
    },
  })

  return (
    <>
      <h1>Dans wizard {step}</h1>
      <div>
        {JSON.stringify(state.value)} <br />
        {JSON.stringify(state.context)}
        <br />
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
      </div>
    </>
  )
}

export default WizardPage
