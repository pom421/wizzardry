import create from "zustand"
import { devtools } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export type WizardryState = Record<string, Record<string, any>>

export type Step<FormData> = {
  label: string
  next?: (state: FormData) => string
}

export type UserFlow<FormData extends Record<string, Record<string, any>>> = {
  initial: string
  final: string
  steps: Step<FormData>[]
}

export type WizardryStore<FormData extends WizardryState> = {
  currentPage: string
  formData: FormData
  firstPage: () => void
  nextPage: () => void
  setPage: (label: string) => void
}

export const buildStore =
  <UserData extends WizardryState>(initialData: UserData) =>
  (userFlow: UserFlow<UserData>) =>
    create<WizardryStore<UserData>>()(
      immer(
        devtools((set) => ({
          currentPage: "",
          formData: initialData,
          setPage: (label: string) =>
            set((state) => {
              if (userFlow.steps.map((step) => step.label).includes(label)) {
                state.currentPage = label
              }
            }),
          firstPage: () => set(() => ({ currentPage: userFlow.initial })),
          nextPage: () => set((state) => ({ currentPage: state.currentPage })),
        })),
      ),
    )
