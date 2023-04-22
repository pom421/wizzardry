/* eslint-disable @typescript-eslint/no-empty-function */
import assert from "assert"
import { z } from "zod"
import { create } from "zustand"
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

const defaultValues: Meta = {
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
export const useFormMeta = create<Actions & { formMeta: Meta }>()(
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
      confirm: (step: keyof Definition) => {
        const { formMeta } = get()
        set({
          formMeta: {
            ...formMeta,
            [step]: {
              ...formMeta[step],
              status: "confirmed",
            },
          },
        })
      },
      unconfirm: (step: keyof Definition) => {
        const { formMeta } = get()
        set({
          formMeta: {
            ...formMeta,
            [step]: {
              ...formMeta[step],
              status: "unconfirmed",
            },
          },
        })
      },
      next: () => {
        const { formMeta } = get()

        const current = get()._getStep(formMeta.currentStep)

        if (current.next) {
          const nextStep = current.next(getState().formData)

          set({
            formMeta: {
              ...formMeta,
              currentStep: nextStep,
              visitedSteps: [...formMeta.visitedSteps, formMeta.currentStep],
            },
          })

          return
        }

        const nextStep = get()._naturalNextStep(formMeta.currentStep)

        set({
          formMeta: {
            ...formMeta,
            currentStep: nextStep || get()._firstStep(),
            visitedSteps: [...formMeta.visitedSteps, formMeta.currentStep],
          },
        })
      },
      previous: () => {
        const { formMeta } = get()

        const currentStep = formMeta.visitedSteps[formMeta.visitedSteps.length - 1] || get().formMeta.currentStep

        set({
          formMeta: {
            ...formMeta,
            currentStep,
            visitedSteps: formMeta.visitedSteps.slice(0, formMeta.visitedSteps.length - 1),
          },
        })
      },
    })),
    {
      name: "wizzardry-form-meta",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
