import { useStepperContext } from "../../lib/utils/StepperContext"

export const Actions = () => {
  const stepper = useStepperContext()

  return (
    <>
      <button disabled={stepper.isFirstStep} onClick={stepper.previous}>
        Previous
      </button>
      <button disabled={stepper.isFinalStep} onClick={stepper.next}>
        Next
      </button>
      <button onClick={() => stepper.resetFormData()}>Reset</button>
    </>
  )
}
