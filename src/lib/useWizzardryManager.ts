import create from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { FlowStateType, initialFlowStateData } from "../configFlow/flowState"
import { UserFlow } from "./wizzardry"

type FormState = {
  formData: FlowStateType
  resetFormData: () => void
  saveFormData: (data: Partial<FlowStateType>) => void
}

type StepState = {
  currentStep: string
  setCurrentStep: (step: string) => void
  visitedSteps: string[]
  goToNextStep: (flowSteps: FlowStateType) => void
  goToPreviousStep: () => void
}

// Some helpers on flowSteps.
export const createFlowStepsHelpers = (flowSteps: UserFlow<FlowStateType>) => {
  const steps = flowSteps.steps.map((step) => step.label)
  const numberOfSteps = flowSteps.steps.length
  const getStepIndexOf = (label: string) => flowSteps.steps.findIndex((step) => step.label === label)
  const firstStep = flowSteps.initial
  const finalStep = flowSteps.final
  const getStepWithName = (label: string) => flowSteps.steps.find((step) => step.label === label)
  /** Natural next step of the current step, assuming there is no next function */
  const naturalNextStep = (label: string) =>
    getStepWithName(getStepIndexOf(label) < numberOfSteps - 1 ? steps[getStepIndexOf(label) + 1] : finalStep)

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
    realNextStep(flowState: FlowStateType, label: string) {
      const currentStep = getStepWithName(label)
      return currentStep.next ? getStepWithName(currentStep.next(flowState)) : naturalNextStep(label)
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
export const createUseWizzardryManager = (helpers: ReturnType<typeof createFlowStepsHelpers>) => {
  const {
    normalizeStep,
    steps,
    numberOfSteps,
    firstStep,
    finalStep,
    getStepIndexOf,
    getStepWithName,
    naturalNextStep,
    realNextStep,
  } = helpers

  return create<FormState & StepState>()(
    persist(
      immer((set) => ({
        currentStep: firstStep,
        visitedSteps: [firstStep],
        setCurrentStep: (step: string) =>
          set((state) => {
            if (state.visitedSteps.includes(step)) {
              state.currentStep = step
            } else {
              console.error("Impossible d'aller à l'étape step, car elle n'a pas été visitée.")
            }
          }),
        goToNextStep: (flowState: FlowStateType) =>
          set((state) => {
            state.currentStep = realNextStep(flowState, state.currentStep).label
            // TODO: gérer tous les cas (si l'on a besoin de skipper des étapes, etc.)
            if (!state.visitedSteps.includes(state.currentStep)) {
              state.visitedSteps.push(state.currentStep)
            }
          }),
        goToPreviousStep: () =>
          set((state) => {
            state.currentStep =
              state.visitedSteps.indexOf(state.currentStep) > 0
                ? state.visitedSteps[state.visitedSteps.indexOf(state.currentStep) - 1]
                : firstStep
          }),
        formData: initialFlowStateData,
        saveFormData: (data: Partial<FlowStateType>) =>
          set((state) => {
            state.formData = { ...state.formData, ...data }
          }),
        resetFormData: () =>
          set((state) => {
            state.formData = initialFlowStateData
          }),
      })),
      {
        name: "store-form7", // name of item in the storage (must be unique)
        getStorage: () => sessionStorage, // formData are removed when user is disconnected
      },
    ),
  )
}
