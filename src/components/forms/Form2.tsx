import * as React from "react"
import { FormStep } from "../../commons/types"

type Props = {
  children: React.ReactNode
}

export const Form2: FormStep<Props> = ({ children }) => {
  return (
    <>
      <h1>Form 2</h1>
      <form>
        <p>
          <label>
            Hobby&nbsp;
            <input name="name" />
          </label>
        </p>
        {children}
      </form>
    </>
  )
}

Form2.label = "form-2"
