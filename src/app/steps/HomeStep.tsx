import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useWizzardryManager } from "../../pages/wizzardry/[[...step]].page"
import { AlertInput } from "../components/AlertInput"
import { AppFormData } from "../wizzardry/AppFormData"

export const homeStepSchema = z.object({
  category: z.union([z.literal("recruiter"), z.literal("worker"), z.literal("")]),
})

type HomeStepType = z.infer<typeof homeStepSchema>

export const HomeStep = () => {
  const formData = useWizzardryManager((state) => state.formData) as AppFormData
  const saveFormData = useWizzardryManager((state) => state.saveFormData)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<HomeStepType>({
    mode: "onChange",
    resolver: zodResolver(homeStepSchema),
    defaultValues: {
      category: formData["home-step"].category || "",
    },
  })

  const onSubmit = (data: HomeStepType) => {
    saveFormData({ "home-step": { category: data.category } })
  }

  return (
    <>
      <h1>First Step</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", maxWidth: 600 }}
        noValidate
      >
        <select {...register("category")} aria-invalid={Boolean(errors.category)}>
          <option value="" disabled>
            Select a category
          </option>
          <option value="recruiter">Recruiter</option>
          <option value="worker">Worker</option>
        </select>

        <AlertInput>{errors?.category?.message}</AlertInput>

        <input type="submit" disabled={isSubmitting || !isValid} />
      </form>
    </>
  )
}
