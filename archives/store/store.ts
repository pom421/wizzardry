import create from "zustand"
import { devtools } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export type WizardryState = Record<string, Record<string, any>>

export type Step<FormData> = {
  label: string // The URL to set in the browser
  next?: (state: FormData) => string
  component: () => JSX.Element
}

export type UserFlow<FormData extends Record<string, Record<string, any>>> = {
  initial: string
  final: string
  steps: Step<FormData>[]
}

export type WizardryStore<FormData extends WizardryState> = {
  currentStep?: Step<FormData>
  canGoPrevious: boolean
  canGoNext: boolean
  formData: FormData
  setPage: (label: string) => void
  firstPage: () => void
  nextPage: () => void
  previousPage: () => void
}

// TODO - faire des actions pour valider une page (et stocker dans le state, dans la partie correspondant à la page), et importer ça dans les pages pour valider puis passer à la page suivante.
export const buildStore =
  <UserData extends WizardryState>(initialData: UserData) =>
  (userFlow: UserFlow<UserData>) => {
    const findIndex = (label: string) => userFlow.steps.findIndex((step) => step.label === label)
    const findComponent = (index: number) => userFlow.steps[index]?.component

    return create<WizardryStore<UserData>>()(
      immer(
        devtools((set) => ({
          currentStep: undefined,
          canGoPrevious: false,
          canGoNext: false,
          formData: initialData,
          setPage: (label: string) =>
            set((state) => {
              if (userFlow.steps.map((step) => step.label).includes(label)) {
                state.currentStep.label = label
                state.currentStep.component = findComponent(findIndex(label))
              }
              const index = findIndex(state.currentStep.label)
              if (index === 0) state.canGoPrevious = false
              if (state.currentStep.label === userFlow.final) state.canGoNext = false
            }),
          firstPage: () =>
            set((state) => {
              state.currentStep.label = userFlow.initial
              state.currentStep.component = findComponent(findIndex(userFlow.initial))
              state.canGoPrevious = false
            }),
          nextPage: () =>
            set((state) => {
              const index = findIndex(state.currentStep.label)
              const nextStep = userFlow.steps[index + 1]
              if (index !== -1 && nextStep) {
                state.currentStep.label = nextStep.next
                  ? nextStep.next(state.formData)
                  : userFlow.steps[index + 1].label
                state.currentStep.component = findComponent(findIndex(state.currentStep.label))
                state.canGoPrevious = true
              }
            }),
          previousPage: () =>
            set((state) => {
              const index = findIndex(state.currentStep.label)
              if (index !== -1 && userFlow.steps[index - 1]) {
                state.currentStep.label = userFlow.steps[index - 1].label
                state.currentStep.component = findComponent(findIndex(state.currentStep.label))
                state.canGoNext = true
              }
            }),
        })),
      ),
    )
  }
