import { useWizzardryManager } from "../../pages/wizzardry/[[...step]].page"

export const Actions = () => {
  const formData = useWizzardryManager((state) => state.formData)
  const goToNextStep = useWizzardryManager((state) => state.goToNextStep)
  const goToPreviousStep = useWizzardryManager((state) => state.goToPreviousStep)

  return (
    <>
      <button onClick={() => goToPreviousStep()}>Previous</button>
      <button onClick={() => goToNextStep(formData)}>Next</button>
    </>
  )
}
