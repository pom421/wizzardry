import { useMachine } from "@xstate/react"
import type { NextPage } from "next"
import { declarationMachine } from "../machines/declarationMachine"

const Home: NextPage = () => {
  const [state, send] = useMachine(declarationMachine)

  return (
    <div>
      {JSON.stringify(state.value)}
      <button
        onClick={() => {
          send("MOUSEOVER")
        }}
      >
        Mouse hover
      </button>
      <button
        onClick={() => {
          send("MOUSEOUT")
        }}
      >
        Mouse out
      </button>
    </div>
  )
}

export default Home
