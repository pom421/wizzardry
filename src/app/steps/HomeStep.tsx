import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useStepperContext } from "../../lib/utils/StepperContext"
import { AlertInput } from "../components/AlertInput"
import { formSchema } from "../wizzardry/AppFormData"

const homeStepSchema = formSchema.pick({ "home-step": true })

type Schema = z.infer<typeof homeStepSchema>

export const HomeStep = () => {
  const stepper = useStepperContext<typeof formSchema>()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<Schema>({
    mode: "onChange",
    resolver: zodResolver(homeStepSchema),
    defaultValues: {
      "home-step": {
        category: stepper.data["home-step"]?.category || "",
      },
    },
  })

  const onSubmit = (data: Schema) => {
    console.log("dans submit", data)

    stepper.saveStep("home-step", { category: data["home-step"].category })

    console.log("data", JSON.stringify(data, null, 2))
  }

  return (
    <>
      <h1>First Step</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", maxWidth: 600 }}
        noValidate
      >
        <select {...register("home-step.category")} aria-invalid={Boolean(errors["home-step"]?.category)}>
          <option value="" disabled>
            Select a category
          </option>
          <option value="recruiter">Recruiter</option>
          <option value="worker">Worker</option>
        </select>

        <AlertInput>{errors["home-step"]?.category?.message}</AlertInput>

        <input type="submit" disabled={isSubmitting || !isValid} />
      </form>
    </>
  )
}
