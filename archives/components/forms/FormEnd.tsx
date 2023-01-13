import * as React from "react"
import { FormStep } from "../../commons/types"

type Props = {
  children: React.ReactNode
}

export const FormEnd: FormStep<Props> = () => {
  return <h1>Form end</h1>
}

FormEnd.label = "form-end"
