import { useWizzardryManager } from "../../pages/wizzardry/[[...step]].page"

export const Actions = () => {
  const formData = useWizzardryManager((state) => state.formData)
  const goToNextStep = useWizzardryManager((state) => state.goToNextStep)
  const goToPreviousStep = useWizzardryManager((state) => state.goToPreviousStep)
  const isFirstStep = useWizzardryManager((state) => state.isFirstStep)
  const isFinalStep = useWizzardryManager((state) => state.isFinalStep)
  const resetFormData = useWizzardryManager((state) => state.resetFormData)

  return (
    <>
      <button disabled={isFirstStep()} onClick={() => goToPreviousStep()}>
        Previous
      </button>
      <button disabled={isFinalStep()} onClick={() => goToNextStep(formData)}>
        Next
      </button>
      <button onClick={() => resetFormData()}>Reset</button>
    </>
  )
}
