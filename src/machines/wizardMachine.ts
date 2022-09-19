import Router from "next/router"
import React from "react"
import { createModel } from "xstate/lib/model"
import { FormStep } from "../commons/types"

const wizardModel = createModel(
  {
    errorMessage: "toto" as string | undefined,
    currentStep: undefined as FormStep<{ children: React.ReactNode }> | undefined,
    allSteps: [] as FormStep<unknown>[],
  },
  {
    events: {
      goToPreviousPage: () => ({}),
      goToNextPage: () => ({}),
    },
  },
)

const getIndex = (steps: FormStep<unknown>[], label: string) => steps.map((form) => form.label).indexOf(label)

export const declarationMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QTAYwDYEMBOmAuAlgPYB2AspqgBYElgB0AwtmPrVAAR0Du9AylSLd2HAA6YYAYihEAKkQAKLAG7EArrAUSwiUKKKwChUrpAAPRAFoAjAE4AHPQDMAdgAMtt9ZdO3LgKwALABMLgA0IACeiABswW70oTFu-v7WbjFOgdYAvjkRKBg4bKQU1LQMzKyEJJw8-ILCtWLa0nJEAHJgZnhaMKb6hsYkphYITrYx9IFOwWkuMdb+wU5pMRHRCP62wfTWq7YTgf4utjv+efkgJEQo8EgghVi4w2U0dEwsbM31AkIi4n6D0GRmIIweY2swWs9Hsvhc1kC9kRyIywQ2iCRU3s2wmGQCq22gTyBTQzxK5Eo70qXxqdTA3AGBlBJghVmCHOc7k83nhQVCGIQ2UCsIR1n27nswXsbmJVyexVeVIqTKGYNG7MCU1cHi8Pj8-PCUUQWV29ilcJiLmy8SRLkuOSAA */
  wizardModel.createMachine(
    {
      id: "declarationMachine",
      predictableActionArguments: true,
      initial: "Creating new",
      states: {
        "Creating new": {
          initial: "Showing page",
          states: {
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
              },
            },
          },
        },
      },
    },
    {
      guards: {
        "Is not the first page": (context) => {
          return context.currentStep.label !== context.allSteps[0].label
        },
        "Is not the last page": (context) => {
          return context.currentStep.label !== context.allSteps[context.allSteps.length - 1].label
        },
      },
      actions: {
        "Calculate previous page": wizardModel.assign((context) => {
          const index = getIndex(context.allSteps, context.currentStep.label)
          return {
            currentStep: context.allSteps[index - 1],
          }
        }),
        "Calculate next page": wizardModel.assign((context) => {
          const index = getIndex(context.allSteps, context.currentStep.label)
          return {
            currentStep: context.allSteps[index + 1],
          }
        }),
        "Store in local storage": (context) => {
          localStorage.setItem("wizardModel-context", JSON.stringify(context))
        },
        "Route to page": (context) => {
          Router.push(`/wizard/${context.currentStep.label}`)
        },
      },
    },
  )
