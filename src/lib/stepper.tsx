import assert from "assert"
import { z } from "zod"

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

// TODO : comment récupérer les steps de any ? Comment le code va puovoir raisonner?

type ZodKey<T extends z.Schema> = keyof z.infer<T>

export class Stepper<T extends z.Schema> {
  private schema: z.Schema
  initial: z.infer<T> = {}
  steps: Step<z.infer<T>>[] = []
  private _currentStep?: ZodKey<T>
  private _visitedSteps: ZodKey<T>[] = []
  private data: z.infer<T> = {}
  private visitedData: z.infer<T> = {}

  constructor(schema: T) {
    this.schema = schema
  }

  // set initial(initial: z.infer<T>) {
  //   this._initial = initial
  // }

  // set steps(steps: Step<z.infer<T>>[]) {
  //   this._steps = steps
  // }

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

  get isFirstStep() {
    return this.currentStep === this.firstStep
  }
  get isFinalStep() {
    return this.currentStep === this.finalStep
  }

  get currentStep() {
    assert(this._currentStep, "The current step is not defined.")

    return this._currentStep
  }

  get visitedSteps() {
    return this._visitedSteps
  }

  indexOfStep(label: ZodKey<T>) {
    const index = this.steps.findIndex((step) => step.label === label)
    assert(index !== -1, "The step " + label.toString() + " does not exist.")
    return index
  }

  getStep(label: ZodKey<T>) {
    const step = this.steps.find((step) => step.label === label)
    assert(step, "The step " + label.toString() + " does not exist.")
    this._currentStep = "toto"
    return step
  }

  naturalNextStep(label: ZodKey<T>) {
    return label !== this.finalStep ? this.steps[this.indexOfStep(label) + 1] : undefined
  }

  realNextStep(currentStep: ZodKey<T>) {
    const step = this.getStep(currentStep)
    return step.next ? this.getStep(step.next(this.data)) : this.naturalNextStep(currentStep)
  }

  next() {
    assert(this.currentStep, "The current step is not defined.")

    this._currentStep = this.realNextStep(this.currentStep)?.label

    const indexCurrentStep = this.indexOfStep(this.currentStep as ZodKey<T>)
    const visitedNextStep = this.visitedSteps[indexCurrentStep + 1] // To check if we have already visited the next step.

    if (!visitedNextStep) {
      this.visitedSteps.push(this.currentStep as ZodKey<T>)
    } else if (visitedNextStep !== this.currentStep) {
      // We cut an unreachable branch of the visited steps and add the new step.
      this._visitedSteps = [...this.visitedSteps.slice(0, indexCurrentStep + 1), this.currentStep as ZodKey<T>]
    }

    // Synchronise the data for the actual steps (some steps can be unreachable and so are their associated data).
    this.visitedData = this.visitedSteps.reduce((acc, step) => ({ ...acc, [step]: this.data[step] }), {})
  }

  previous() {
    assert(this.currentStep, "The current step is not defined.")

    this._currentStep =
      this.visitedSteps.indexOf(this.currentStep) > 0
        ? this.visitedSteps[this.visitedSteps.indexOf(this.currentStep) - 1]
        : this.firstStep
  }

  saveStep<K extends ZodKey<T>>(label: K, data: z.infer<T>[K]) {
    this.data = { ...this.data, [label]: data }
    this.next()
  }

  resetFormData() {
    this.data = this.initial
    this._currentStep = this.firstStep
    this._visitedSteps = [this.firstStep]
    this.visitedData = {}
  }
}
