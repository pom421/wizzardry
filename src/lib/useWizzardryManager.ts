import assert from "assert"
import { castDraft } from "immer"
import create from "zustand"
import { devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export type WizzardryFormData = Record<string, Record<string, unknown> | undefined>

export type WizzardryStep<FormData extends WizzardryFormData> = {
  label: keyof FormData // The URL to set in the browser
  next?: (state: FormData) => keyof FormData
  component: () => JSX.Element
}

type WizzardryManager<FormData extends WizzardryFormData> = {
  formData: Partial<FormData>
  currentStep: keyof FormData
  visitedSteps: Array<keyof Partial<FormData>>
  visitedFormData: Partial<FormData>
  resetFormData: () => void
  saveFormData: (formData: Partial<FormData>) => void
  setCurrentStep: (step: keyof FormData) => void
  isFirstStep: () => boolean
  isFinalStep: () => boolean
  goToNextStep: () => void
  goToPreviousStep: () => void
}

// Some helpers on appSteps.
export const createFlowStepsHelpers = <FormData extends WizzardryFormData>(
  appSteps: WizzardryStep<FormData>[],
  initialAppFormData: FormData,
) => {
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
  const getStepIndex = <K extends keyof FormData>(label: K) => {
    const index = appSteps.findIndex((step) => step.label === label)
    assert(index !== -1, "The step " + label.toString() + " does not exist.")
    return index
  }

  const firstStep = appSteps[0].label
  const finalStep = lastStep.label
  const getStep = <K extends keyof FormData>(label: K) => {
    const step = appSteps.find((step) => step.label === label)
    assert(step, "The step " + label.toString() + " does not exist.")
    return step
  }
  /** Natural next step of the current step, assuming there is no next function */
  const naturalNextStep = <K extends keyof FormData>(label: K) =>
    label !== finalStep ? appSteps[getStepIndex(label) + 1] : undefined

  const getStepInUrl = (path: string): keyof typeof initialAppFormData | undefined => {
    const [, step] = path.split("/").filter(Boolean)

    if (step && step in initialAppFormData) {
      return step
    }
  }

  return {
    normalizeStep: (query: string | string[]) => (Array.isArray(query) ? (query.length > 0 ? query[0] : "") : query),
    steps,
    numberOfSteps,
    firstStep,
    finalStep,
    getStepIndex,
    getStep,
    naturalNextStep,
    /** Real next step of the current step, using next function if any */
    realNextStep<K extends keyof FormData>(formData: FormData, currentStep: K) {
      const step = getStep(currentStep)
      return step.next ? getStep(step.next(formData)) : naturalNextStep(currentStep)
    },
    getStepInUrl,
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
  helpers: ReturnType<typeof createFlowStepsHelpers<FormData>>,
  initialFlowStateData: FormData,
) => {
  const {
    // normalizeStep,
    // steps,
    // numberOfSteps,
    firstStep,
    finalStep,
    // getStepIndex,
    // getStep,
    // naturalNextStep,
    realNextStep,
  } = helpers

  const x: FormData = {}

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
              state.formData = castDraft(initialFlowStateData)
              state.currentStep = castDraft(firstStep)
              state.visitedSteps = [castDraft(firstStep)]
              state.visitedFormData = {}
            }),
          currentStep: firstStep,
          visitedSteps: [firstStep],
          visitedFormData: {},
          setCurrentStep: (step: keyof FormData) =>
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
          goToNextStep: () =>
            set((state) => {
              const indexCurrentStep = state.visitedSteps.indexOf(state.currentStep)
              const visitedNextStep = state.visitedSteps[indexCurrentStep + 1]
              state.currentStep = realNextStep(get().formData, get().currentStep)?.label || get().currentStep

              if (!visitedNextStep) {
                state.visitedSteps.push(state.currentStep)
              } else if (visitedNextStep !== state.currentStep) {
                // We cut an unreachable branch of the visited steps and add the new step.
                state.visitedSteps = [...state.visitedSteps.slice(0, indexCurrentStep + 1), state.currentStep]
              }

              state.visitedFormData = state.visitedSteps.reduce(
                (acc, step) => ({ ...acc, [step]: state.formData[step] }),
                {} as FormData,
              )
            }),
          goToPreviousStep: () =>
            set((state) => {
              state.currentStep =
                state.visitedSteps.indexOf(state.currentStep) > 0
                  ? state.visitedSteps[state.visitedSteps.indexOf(state.currentStep) - 1]
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
