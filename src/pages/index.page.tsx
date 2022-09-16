import { useMachine } from "@xstate/react"
import type { NextPage } from "next"
import { declarationMachine } from "../machines/firstMachine"

const Home: NextPage = () => {
  const [state, send] = useMachine(declarationMachine)

  return (
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
  )
}

export default Home
