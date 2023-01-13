import Router from "next/router"
import { ContextFrom, EventFrom } from "xstate"
import { createModel } from "xstate/lib/model"

import { FormStep } from "../commons/types"

type StepStatus = { label: string; status: "unreachable" | "visited" | "valid" | "invalid" | "obsolete" }

export type WizardryContext = ContextFrom<typeof wizardModel>

export type WizardryEvent = EventFrom<typeof wizardModel>

const wizardModel = createModel(
  {
    errorMessage: undefined as string | undefined,
    currentStepLabel: undefined as string | undefined,
    allSteps: [] as FormStep<unknown>[],
    stepsStatus: [] as StepStatus[],
    data: {} as Record<string, any>, // content of all forms in a form { form1: { name: "toto" }, form2: { age: 32 }}
  },
  {
    events: {
      goToPreviousPage: () => ({}),
      goToNextPage: () => ({}),
      goToPage: ({ step }: { step: string }) => ({ step }),
    },
  },
)

const getIndex = (steps: FormStep<unknown>[], label: string) => steps.map((form) => form.label).indexOf(label)

const statusForStep = (stepsStatus: StepStatus[], searchedStep: string) => {
  const stepStatus = stepsStatus.filter((step) => step.label === searchedStep)

  if (stepStatus.length) return stepStatus[0] || undefined
}

export const declarationMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QTAYwDYEMBOmAuAlgPYB2AspqgBYElgB0AwtmPrVAAR0Du9AkiQJ4AxIlAAHIrCHESYkAA9EARmUB2egDYAHAE4ArACZ92gCwBmbQAZzhgDQgAnonPLD9Xdd3ndpw8t1lbU1NAF9QhxQMHDZSCmpaBmZWQhJOHnoAZSoibnYOcUwYYSgiABUiAAUWADdiAFdYSqKweUlpQlJ5JQQAWiCNPWULZU1XQLU1fQdnBDVvenM1TWXgwMMDU3DItCxcTvJKGjomFjY0rjBebNz8wuLSioA5MAU8Zpg2qRkupEUXUzaeimQKaEE+Uxg7TaaZORDaNRWRbLUamfQWNF6bYgKJ7WKHBInZLndJXLI5PIXe5gErlKotL4dWTdAFAtSuKY+SzmTEzRDo0z0ZTmfTeXz6ea6YzhCIgEhEFDwP64mIHeLHJJnVKk3gCISMn5yP49Xr+TTA4LCtSAtTaJZWbR8hCGRH0CXCtEBMz6bEq-aydWJU4pfIZG6UzjUg0HFkIZTorT+HxqQyAoLqR1whCmKxIsZGKwGXTWzRuX27VUBo5B4nay7caPM42IU05i2lpY2u2IzOzL1uu1WTT6Kz6fSaIdLcvRf1xat0Ru-UAmwxg9tWrtLZROtzm0WmW26HSqHkrGWhIA */
  wizardModel.createMachine(
    {
      predictableActionArguments: true,
      id: "declarationMachine",
      initial: "Creating new",
      states: {
        "Creating new": {
          initial: "Init",
          states: {
            Init: {
              entry: "Init first step",
              always: {
                target: "Showing page",
              },
            },
            "Showing page": {
              on: {
                goToPreviousPage: {
                  actions: ["Calculate previous page", "Store in local storage", "Route to page"],
                  cond: "Is not the first page",
                },
                goToNextPage: {
                  actions: ["Calculate next page", "Store in local storage", "Route to page"],
                  cond: "Is not the last page",
                },
                goToPage: {
                  actions: ["Stick current step", "Store in local storage", "Route to page"],
                  cond: "Is the page reachable",
                },
              },
            },
          },
        },
      },
    },
    {
      guards: {
        "Is not the first page": (context) => {
          return context.currentStepLabel !== context.allSteps[0].label
        },
        "Is not the last page": (context) => {
          return context.currentStepLabel !== context.allSteps[context.allSteps.length - 1].label
        },
        "Is the page reachable": (context, event) => {
          if (event.type !== "goToPage") return

          // return statusForStep(context.stepsStatus, event.step).status !== "unreachable"
          return true
        },
      },
      actions: {
        "Init first step": wizardModel.assign((context) => {
          return {
            currentStepLabel: context.allSteps[0].label,
          }
        }),
        "Stick current step": wizardModel.assign((context, event) => {
          if (event.type !== "goToPage") return

          const index = getIndex(context.allSteps, event.step)

          console.log("dans Stick current step", event.step)

          return {
            currentStepLabel: context.allSteps[index].label,
          }
        }),
        "Calculate previous page": wizardModel.assign((context) => {
          const index = getIndex(context.allSteps, context.currentStepLabel)
          return {
            currentStepLabel: context.allSteps[index - 1].label,
          }
        }),
        "Calculate next page": wizardModel.assign((context) => {
          const index = getIndex(context.allSteps, context.currentStepLabel)
          return {
            currentStepLabel: context.allSteps[index + 1].label,
          }
        }),
        "Store in local storage": (context) => {
          localStorage.setItem("wizardModel-context", JSON.stringify(context))
        },
        "Route to page": (context) => {
          Router.push(`/wizard/${context.currentStepLabel}`)
        },
      },
    },
  )
