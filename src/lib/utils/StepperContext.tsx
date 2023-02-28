import { createContext, useContext } from "react"
import { z } from "zod"
import { Stepper } from "../stepper"

const InnerStepperContext = createContext<unknown>(null)

export const useStepperContext = <T extends z.Schema>() => {
  const stepper = useContext(InnerStepperContext as unknown as React.Context<Stepper<T>>)

  if (!stepper) {
    throw new Error("useStepperContext must be used within a StepperContext")
  }

  return stepper
}

export const StepperContext = <T extends z.Schema>({
  stepper,
  children,
}: {
  stepper: Stepper<T>
  children: React.ReactNode
}) => {
  return <InnerStepperContext.Provider value={stepper}>{children}</InnerStepperContext.Provider>
}
