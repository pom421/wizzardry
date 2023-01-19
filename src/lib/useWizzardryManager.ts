import create from "zustand"
import { devtools, persist } from "zustand/middleware"
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
  visitedFormData: Partial<FlowStateType>
  isFirstStep: () => boolean
  isFinalStep: () => boolean
  goToNextStep: (flowSteps: FlowStateType) => void
  goToPreviousStep: () => void
}

// Some helpers on flowSteps.
export const createFlowStepsHelpers = (flowSteps: UserFlow<FlowStateType>) => {
  const steps = flowSteps.map((step) => step.label)
  const numberOfSteps = flowSteps.length
  const getStepIndexOf = (label: string) => flowSteps.findIndex((step) => step.label === label)
  const firstStep = flowSteps[0].label
  const finalStep = flowSteps[flowSteps.length - 1].label
  const getStepWithName = (label: string) => flowSteps.find((step) => step.label === label)
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
      immer(
        devtools((set, get) => ({
          formData: initialFlowStateData,
          saveFormData: (data: Partial<FlowStateType>) =>
            set((state) => {
              state.formData = { ...state.formData, ...data }
            }),
          resetFormData: () =>
            set((state) => {
              state.formData = initialFlowStateData
            }),
          currentStep: firstStep,
          visitedSteps: [firstStep],
          visitedFormData: {},
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
          goToNextStep: (flowState: FlowStateType) =>
            set((state) => {
              const indexCurrentStep = state.visitedSteps.indexOf(state.currentStep)
              const visitedNextStep = state.visitedSteps[indexCurrentStep + 1]
              state.currentStep = realNextStep(flowState, state.currentStep).label
              if (!visitedNextStep) {
                state.visitedSteps.push(state.currentStep)
              } else if (visitedNextStep !== state.currentStep) {
                // We cut an unreachable branch of the visited steps and add the new step.
                state.visitedSteps = [...state.visitedSteps.slice(0, indexCurrentStep + 1), state.currentStep]
              }

              state.visitedFormData = state.visitedSteps.reduce(
                (acc, step) => ({ ...acc, [step]: state.formData[step] }),
                {},
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
        name: "store-form11", // name of item in the storage (must be unique)
        getStorage: () => sessionStorage, // formData are removed when user is disconnected
      },
    ),
  )
}
