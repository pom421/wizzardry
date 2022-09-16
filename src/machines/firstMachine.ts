import { assign, createMachine } from "xstate"

export const EGAPRO_STEPS = ["page1", "page2", "page3", "page4"]

export const declarationMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QTAYwDYEMBOmAuAlgPYB2AspqgBYElgB0AwtmPrVAAR0Du9AylSLd2HAA6YYAYjoAPPIlCiisAoVIKQMxACYA7AEZ6AVgAcANiMBmACxGzABiMBOS2csAaEAE9E1-U-pdbWttU0tLEz8je2sAX1jPFAwcNlIKaloGZlZCEk4efkFhPLEJMElRFgA3YgBXeCQQJRU1Eg0tBABaS396fQt9cPsTEx7tE08fBGtw+m0zXXC9XVse+ISQEiIUBuQ0LFxW9Jo6JhY2EoKBIRFxGA1m1WI2xo79a3onEZNoo319SLBcyTRCWeyGSxGGZOMyjebWXQmeKJfYpI6UE5Zc65fJgbgPZRPdSvRDdGZ9AZDEZjCbeHTaAKuMz-cH-aywlbIkBJA6pcgYzIElrPdqk1y6Cl-KmjfTjEEIfRGCWWXSI7ThJz2cYwpHrIA */
  createMachine(
    {
      context: {
        errorMessage: undefined as string | undefined,
        currentStep: EGAPRO_STEPS[0] as string | undefined,
      },
      tsTypes: {} as import("./firstMachine.typegen").Typegen0,
      schema: {
        events: {} as { type: "previous" } | { type: "next" },
        // services: {} as {
        //   goToStep: {
        //     data: void
        //   }
        // },
      },
      id: "declarationMachine",
      initial: "Creating new",
      states: {
        "Creating new": {
          initial: "Showing page",
          states: {
            "Showing page": {
              on: {
                previous: {
                  actions: "Decrement step",
                  cond: "Is not the first page",
                },
                next: {
                  actions: "Increment step",
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
          return context.currentStep !== EGAPRO_STEPS[0]
        },
        "Is not the last page": (context) => {
          return context.currentStep !== EGAPRO_STEPS[EGAPRO_STEPS.length - 1]
        },
      },
      actions: {
        "Increment step": assign((context, event) => {
          const index = EGAPRO_STEPS.indexOf(context.currentStep)
          return {
            currentStep: EGAPRO_STEPS[index + 1],
          }
        }),
        "Decrement step": assign((context, event) => {
          const index = EGAPRO_STEPS.indexOf(context.currentStep)
          return {
            currentStep: EGAPRO_STEPS[index - 1],
          }
        }),
      },
    },
  )
