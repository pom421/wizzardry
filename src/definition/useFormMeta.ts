/* eslint-disable @typescript-eslint/no-empty-function */
import { z } from "zod"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { Definition, definition } from "./schema"

type Meta = {
  [key in keyof Definition]: {
    status: "unconfirmed" | "confirmed" | undefined
  }
} & {
  currentStep: keyof Definition
  visitedSteps: (keyof Definition)[]
}

type Actions = {
  resetFormMeta: () => void
  confirm: (step: keyof Definition) => void
  unconfirm: (step: keyof Definition) => void
  next: () => void
  previous: () => void
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

export type Step<FormData> = {
  label: keyof FormData
  title: string
  route: string
  next?: (state: FormData) => keyof FormData
  confirm: () => void
  unconfirm: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- we need to keep the parameter to infer the type
export const buildSteps = <T extends z.Schema>(schema: T) => {
  return ({ steps }: { steps: Step<z.infer<T>>[] }) => ({
    steps,
  })
}

function getStepFromLabel(label: string) {
  let res: { step: Step; index: number }

  for (let i = 0; i < steps.length; i++) {
    if (steps[i].label === label) {
      res = {
        step: steps[i],
        index: i,
      }
      break
    }
  }
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
      resetFormMeta: () =>
        set({
          formMeta: defaultValues,
        }),
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
        set({
          formMeta: {
            ...formMeta,
            currentStep: formMeta.currentStep === "confirmation-step" ? "confirmation-step" : "worker-step",
            visitedSteps: [...formMeta.visitedSteps, formMeta.currentStep],
          },
        })
      },
      previous: () => {
        const { formMeta } = get()
        set({
          formMeta: {
            ...formMeta,
            currentStep: formMeta.visitedSteps[formMeta.visitedSteps.length - 1],
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
