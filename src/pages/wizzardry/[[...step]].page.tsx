import { NextPage } from "next"
import { useRouter } from "next/router"
import { ClientOnly } from "../../app/components/ClientOnly"
import { Actions, ConfirmationStep, HomeStep, RecruiterStep, WorkerStep } from "../../app/steps"
import { formSchema } from "../../app/wizzardry/AppFormData"
import { WizzardryDebug } from "../../lib/components/WizzardryDebug"
import { Stepper } from "../../lib/stepper"
import { StepperContext } from "../../lib/utils/StepperContext"

const stepper = new Stepper(formSchema).configure({
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

const WizzardryPage: NextPage = () => {
  const router = useRouter()
  const currentStep = stepper.currentStep
  const visitedSteps = stepper.visitedSteps

  const Component = stepper.getStep(currentStep).component

  // // Sync the URL with the current step.
  // useEffect(() => {
  //   const stepInUrl = getStepInUrl(router.asPath)
  //   if (stepInUrl && currentStep !== stepInUrl && !visitedSteps.includes(stepInUrl)) {
  //     router.push(currentStep, undefined, { shallow: true })
  //   }
  // }, [router.asPath, currentStep, router, visitedSteps])

  return (
    <ClientOnly>
      <h1>Wizzardry</h1>

      {currentStep && (
        <>
          <StepperContext stepper={stepper}>
            <Actions />
            <div style={{ minHeight: 300 }}>
              <>
                <Component />
              </>
            </div>
            <WizzardryDebug />
          </StepperContext>
        </>
      )}

      <hr />
    </ClientOnly>
  )
}

export default WizzardryPage

// if (process.env.NODE_ENV === "development") {
//   mountStoreDevtool("useWizzardryManager", useWizzardryManager)
// }
