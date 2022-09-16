import { useMachine } from "@xstate/react"
import type { NextPage } from "next"
import { declarationMachine, EGAPRO_STEPS } from "../../machines/firstMachine"

export async function getServerSideProps({ query }) {
  const { step } = query

  return {
    props: {
      step,
    },
  }
}

const WizardPage: NextPage = ({ step }: { step: string[] }) => {
  // const router = useRouter()

  const normalizedStep = EGAPRO_STEPS.indexOf(step[0]) >= 0 ? step[0] : EGAPRO_STEPS[0]

  const [state, send] = useMachine(declarationMachine, {
    context: {
      currentStep: normalizedStep,
    },
    // services: {
    //   goToStep: (stepName) => router.push("wizard/" + stepName),
    // },
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
            send("previous")
          }}
        >
          Previous
        </button>
        <button
          onClick={() => {
            send("next")
          }}
        >
          Next
        </button>
      </div>
    </>
  )
}

export default WizardPage
