/* eslint-disable @typescript-eslint/no-empty-function */
import assert from "assert"
import { z } from "zod"
import { createStore, useStore } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { Definition, definition } from "./schema"
import { vanillaStoreFormData } from "./useFormData"

type Meta = {
  [key in keyof Definition]: {
    status: "unconfirmed" | "confirmed" | undefined
  }
} & {
  currentStep: keyof Definition
  visitedSteps: (keyof Definition)[]
}

// type ZodKey<T extends z.AnyZodObject> = keyof z.infer<T>

type Actions = {
  resetFormMeta: () => void
  confirm: (step: keyof Definition) => void
  unconfirm: (step: keyof Definition) => void
  next: () => void
  previous: () => void
  _nbSteps: () => number
  _firstStep: () => keyof Definition
  _finalStep: () => keyof Definition
  _indexOfStep: (label: keyof Definition) => number
  _getStep: (label: keyof Definition) => Step<Definition>
  _naturalNextStep: (label: keyof Definition) => keyof Definition | undefined
}

export const defaultValues: Meta = {
  "home-step": {
    status: "unconfirmed",
  },
  "recruiter-step": {
    status: "unconfirmed",
  },
  "worker-step": {
    status: "unconfirmed",
  },
  "confirmation-step": {
    status: "unconfirmed",
  },
  currentStep: "home-step",
  visitedSteps: [],
}

export type Step<Definition> = {
  label: keyof Definition
  title: string
  route: string
  next?: (state: Definition) => keyof Definition
  confirm: () => void
  unconfirm: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- we need to keep the parameter to infer the type
export const buildSteps = <T extends z.Schema>(schema: T) => {
  return ({ steps }: { steps: Step<z.infer<T>>[] }) => ({
    steps,
  })
}

export const { steps } = buildSteps(definition)({
  steps: [
    {
      label: "home-step",
      title: "Index",
      route: "/",
      next: (state) => (state["home-step"].category === "recruiter" ? "recruiter-step" : "worker-step"), // Optional routing logic. By default, the next step is the next one in the array.
      confirm: () => {}, // reducer when the step is confirmed. By default, the current step is confirmed but you can add more logic here.
      unconfirm: () => {},
    },
    {
      label: "recruiter-step",
      title: "Recruteur",
      route: "/recruteur",
      next: () => "confirmation-step",
      confirm: () => {},
      unconfirm: () => {},
    },
    {
      label: "worker-step",
      title: "Travailleur",
      route: "/travailleur",
      confirm: () => {},
      unconfirm: () => {},
    },
    {
      label: "confirmation-step",
      title: "Confirmation",
      route: "/confirmation",
      confirm: () => {},
      unconfirm: () => {},
    },
  ],
})

const { getState } = vanillaStoreFormData

/**
 * Hook to get and handle the state of the form.
 *
 * @example
 * ```ts
 * const { formMeta, saveFormMeta, resetFormMeta } = useFormMeta();
 * ```
 */
export const vanillaStoreFormMeta = createStore<Actions & { formMeta: Meta }>()(
  persist(
    immer((set, get) => ({
      formMeta: defaultValues,
      _nbSteps: () => steps.length,
      _firstStep: () => {
        assert(steps[0], "The stepper must have at least one step.")

        return steps[0].label
      },
      _finalStep: () => {
        const last = steps[steps.length - 1] // Needed for TS.
        assert(last, "The stepper must have at least one step.")

        return last.label
      },
      resetFormMeta: () =>
        set({
          formMeta: defaultValues,
        }),
      _indexOfStep: (label: keyof Definition) => {
        const index = steps.findIndex((step) => step.label === label)
        assert(index !== -1, "The step " + label.toString() + " does not exist.")

        return index
      },
      _getStep: (label: keyof Definition) => {
        const step = steps.find((step) => step.label === label)
        assert(step, "The step " + label.toString() + " does not exist.")

        return step
      },
      _naturalNextStep: (label: keyof Definition) => {
        const nextStep = steps[get()._indexOfStep(label) + 1]

        assert(label !== get()._finalStep() && nextStep !== undefined, "For everty step but the last, we can go ahead")

        return label !== get()._finalStep() ? nextStep.label : undefined
      },
      confirm: (step: keyof Definition) =>
        set((state) => {
          state.formMeta[step].status = "confirmed"
        }),

      unconfirm: (step: keyof Definition) =>
        set((state) => {
          state.formMeta[step].status = "unconfirmed"
        }),

      next: () =>
        set((state) => {
          const current = state._getStep(state.formMeta.currentStep)

          const nextStep = current.next
            ? current.next(getState().formData)
            : state._naturalNextStep(state.formMeta.currentStep)

          state.formMeta.currentStep = nextStep || state._firstStep()
          state.formMeta.visitedSteps.push(state.formMeta.currentStep)
        }),

      previous: () =>
        set((state) => {
          const indexOfCurrentStep = state.formMeta.visitedSteps.findIndex(
            (step) => step === state.formMeta.currentStep,
          )

          state.formMeta.currentStep = state.formMeta.visitedSteps[indexOfCurrentStep - 1] || state.formMeta.currentStep
        }),
    })),
    {
      name: "wizzardry-form-meta",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export const useFormMeta = (selector: (state: Actions & { formMeta: Meta }) => unknown) =>
  useStore(vanillaStoreFormMeta, selector)
