import assert from "assert"
import { Draft } from "immer"
import create from "zustand"
import { devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export type WizzardryFormData = Record<string, Record<string, any> | never>

export type WizzardryStep<FormData extends WizzardryFormData> = {
  label: keyof FormData // The URL to set in the browser
  next?: (state: FormData) => string
  component: () => JSX.Element
}

type WizzardryManager<FormData extends WizzardryFormData> = {
  formData: FormData
  currentStep: string
  visitedSteps: string[]
  visitedFormData: FormData
  resetFormData: () => void
  saveFormData: (formData: Partial<FormData>) => void
  setCurrentStep: (step: string) => void
  isFirstStep: () => boolean
  isFinalStep: () => boolean
  goToNextStep: (formData: FormData) => void
  goToPreviousStep: () => void
}

// Some helpers on appSteps.
export const createFlowStepsHelpers = <FormData extends WizzardryFormData>(appSteps: WizzardryStep<FormData>[]) => {
  if (appSteps.length === 0) throw new Error("appSteps must have at least one step.")
  assert(typeof appSteps[0] !== "undefined", "appSteps must have at least one step.")
  const lastStep = appSteps[appSteps.length - 1] // TS needs to extract this as an identifier.
  assert(typeof lastStep !== "undefined", "appSteps must have at least one step.")

  const steps = appSteps.map((step) => step.label)
  const numberOfSteps = appSteps.length
  /**
   * Return index of the step with the given label.
   *
   * Throw an error if the step does not exist.
   */
  const getStepIndexOf = (label: string) => {
    const index = appSteps.findIndex((step) => step.label === label)
    assert(index !== -1, "The step " + label + " does not exist.")
    return index
  }

  const firstStep = appSteps[0].label
  const finalStep = lastStep.label
  const getStepWithName = (label: string) => {
    const step = appSteps.find((step) => step.label === label)
    assert(step, "The step " + label + " does not exist.")
    return step
  }
  /** Natural next step of the current step, assuming there is no next function */
  const naturalNextStep = (label: string) => (label !== finalStep ? appSteps[getStepIndexOf(label) + 1] : undefined)

  return {
    normalizeStep: (query: string | string[]) => (Array.isArray(query) ? (query.length > 0 ? query[0] : "") : query),
    steps,
    numberOfSteps,
    firstStep,
    finalStep,
    getStepIndexOf,
    getStepWithName,
    naturalNextStep,
    /** Real next step of the current step, using next function if any */
    realNextStep(appFormData: FormData, label: string) {
      const currentStep = getStepWithName(label)
      return currentStep.next ? getStepWithName(currentStep.next(appFormData)) : naturalNextStep(label)
    },
  }
}

/**
 * Hook to get and handle the state of the form.
 *
 * @example
 * ```ts
 * const { formData, saveFormData, resetFormData, currentStep, setCurrentStep } = useFormManager();
 * ```
 */
export const createUseWizzardryManager = <FormData extends WizzardryFormData>(
  helpers: ReturnType<typeof createFlowStepsHelpers>,
  initialFlowStateData: FormData,
) => {
  const {
    // normalizeStep,
    // steps,
    // numberOfSteps,
    firstStep,
    finalStep,
    // getStepIndexOf,
    // getStepWithName,
    // naturalNextStep,
    realNextStep,
  } = helpers

  return create<WizzardryManager<FormData>>()(
    persist(
      immer(
        devtools((set, get) => ({
          formData: initialFlowStateData,
          saveFormData: (formData: Partial<FormData>) =>
            set((state) => {
              state.formData = { ...state.formData, ...formData }
            }),
          resetFormData: () =>
            set((state) => {
              state.formData = initialFlowStateData as Draft<FormData>
              state.currentStep = firstStep
              state.visitedSteps = [firstStep]
              state.visitedFormData = {} as Draft<FormData>
            }),
          currentStep: firstStep,
          visitedSteps: [firstStep],
          visitedFormData: {} as FormData,
          setCurrentStep: (step: string) =>
            set((state) => {
              if (state.visitedSteps.includes(step)) {
                state.currentStep = step
              } else {
                console.error("Impossible d'aller à l'étape step, car elle n'a pas été visitée.")
              }
            }),
          isFirstStep: () => get().currentStep === firstStep,
          isFinalStep: () => get().currentStep === finalStep,
          // Using the flow state, we can determine the next step. If the next step is not in the visited steps, we add it.
          goToNextStep: (formData: FormData) =>
            set((state) => {
              const indexCurrentStep = state.visitedSteps.indexOf(state.currentStep)
              const visitedNextStep = state.visitedSteps[indexCurrentStep + 1]
              state.currentStep = realNextStep(formData, state.currentStep)?.label || state.currentStep
              if (!visitedNextStep) {
                state.visitedSteps.push(state.currentStep)
              } else if (visitedNextStep !== state.currentStep) {
                // We cut an unreachable branch of the visited steps and add the new step.
                state.visitedSteps = [...state.visitedSteps.slice(0, indexCurrentStep + 1), state.currentStep]
              }

              state.visitedFormData = state.visitedSteps.reduce(
                (acc, step) => ({ ...acc, [step]: state.formData[step] }),
                {} as Draft<FormData>,
              )
            }),
          goToPreviousStep: () =>
            set((state) => {
              state.currentStep =
                state.visitedSteps.indexOf(state.currentStep) > 0
                  ? (state.visitedSteps[state.visitedSteps.indexOf(state.currentStep) - 1] as string)
                  : firstStep
            }),
        })),
      ),
      {
        name: "store-form12", // name of item in the storage (must be unique)
        getStorage: () => sessionStorage, // formData are removed when user is disconnected
      },
    ),
  )
}
