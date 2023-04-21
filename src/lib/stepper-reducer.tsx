import assert from "assert"
import produce from "immer"
import { z } from "zod"
import { ConfirmationStep, HomeStep, RecruiterStep, WorkerStep } from "../app/steps"
import { formSchema } from "../app/wizzardry/AppFormData"

export type Step<FormData> = {
  label: keyof FormData // The URL to set in the browser
  next?: (state: FormData) => keyof FormData
  component: () => JSX.Element
}

export const buildSteps = <T extends z.Schema>(schema: T) => {
  return ({ initial, steps }: { initial: z.infer<T>; steps: Step<z.infer<T>>[] }) => ({
    schema,
    initial,
    steps,
  })
}

type ZodKey<T extends z.Schema> = keyof z.infer<T>

export class StepperEngine<T extends z.Schema> {
  private schema: z.Schema
  initial: z.infer<T> = {}
  steps: Step<z.infer<T>>[] = []

  constructor(schema: T) {
    this.schema = schema
  }

  configure({ initial, steps }: { initial: z.infer<T>; steps: Step<z.infer<T>>[] }) {
    this.initial = initial
    this.steps = steps

    return this
  }

  get nbSteps() {
    return this.steps.length
  }

  get firstStep() {
    assert(this.steps[0], "The stepper must have at least one step.")

    return this.steps[0].label
  }

  get finalStep() {
    const last = this.steps[this.steps.length - 1] // Needed for TS.
    assert(last, "The stepper must have at least one step.")

    return last.label
  }

  indexOfStep(label: ZodKey<T>) {
    const index = this.steps.findIndex((step) => step.label === label)
    assert(index !== -1, "The step " + label.toString() + " does not exist.")
    return index
  }

  getStep(label: ZodKey<T>) {
    const step = this.steps.find((step) => step.label === label)
    assert(step, "The step " + label.toString() + " does not exist.")
    return step
  }

  naturalNextStep(label: ZodKey<T>) {
    return label !== this.finalStep ? this.steps[this.indexOfStep(label) + 1] : undefined
  }

  stepperReducer(state: StepperState<T>, action: StepperAction<T>) {
    switch (action.type) {
      case "previous": {
        assert(state.currentStep, "The current step is not defined.")

        return produce(state, (draft) => {
          draft.currentStep =
            draft.visitedSteps.indexOf(draft.currentStep) > 0
              ? (draft.visitedSteps[draft.visitedSteps.indexOf(draft.currentStep) - 1] as any)
              : this.firstStep
        })
      }
      case "saveStep": {
        const { stepLabel, stepData } = action.payload

        return produce(state, (draft) => {
          draft.data = { ...draft.data, [stepLabel]: stepData }
        })
      }
      case "resetFormData": {
        return produce(state, (draft) => {
          draft.data = this.initial
          draft.currentStep = this.firstStep as any
          draft.visitedSteps = [this.firstStep as any]
          draft.visitedData = {} as any
        })
      }
      default:
        throw new Error("Action is not supported")
    }
  }
}

type StepperAction<T extends z.Schema> =
  | {
      type: "next"
    }
  | {
      type: "previous"
    }
  | {
      type: "saveStep"
      payload: {
        stepLabel: ZodKey<T>
        stepData: z.infer<T>
      }
    }
  | {
      type: "resetFormData"
    }
// next | previous | goToStep | resetFormData | saveStep

type StepperState<T extends z.Schema> = {
  currentStep: ZodKey<T>
  visitedSteps: ZodKey<T>[]
  data: z.infer<T>
  visitedData: Partial<z.infer<T>>
}

const stepperEngine = new StepperEngine(formSchema).configure({
  initial: {
    "home-step": {
      category: "",
    },
    "recruiter-step": {
      company: "",
      searchedSkill: "",
    },
    "worker-step": {
      name: "",
      favoriteSkill: "",
    },
    "confirmation-step": {
      message: "",
    },
  },
  steps: [
    {
      label: "home-step",
      next: (state) => (state["home-step"].category === "recruiter" ? "recruiter-step" : "worker-step"),
      component: HomeStep,
    },
    {
      label: "recruiter-step",
      next: () => "confirmation-step",
      component: RecruiterStep,
    },
    {
      label: "worker-step",
      component: WorkerStep,
    },
    { label: "confirmation-step", component: ConfirmationStep },
  ],
})

const initialState: StepperState<typeof formSchema> = {
  data: stepperEngine.initial,
  currentStep: stepperEngine.firstStep,
  visitedSteps: [],
  visitedData: {},
}

let newState = stepperEngine.stepperReducer(initialState, { type: "resetFormData" })
newState = stepperEngine.stepperReducer(newState, { type: "previous" })
