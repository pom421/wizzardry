import * as React from "react"
import { FormStep } from "../../commons/types"

type Props = {
  children: React.ReactNode
}

export const Form1: FormStep<Props> = ({ children }) => {
  return (
    <>
      <h1>Form 1</h1>
      <form>
        <p>
          <label>
            Name&nbsp;
            <input name="name" />
          </label>
        </p>
        {children}
      </form>
    </>
  )
}

Form1.label = "form-1"
