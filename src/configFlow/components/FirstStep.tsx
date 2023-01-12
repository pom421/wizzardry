import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertInput } from "../../components/AlertInput"
import { useFormManager } from "../../lib/useFormManager"

export const firstStepSchema = z.object({
  category: z.union([z.literal("recruiter"), z.literal("worker"), z.literal("")]),
})

type FirstStepType = z.infer<typeof firstStepSchema>

export const FirstStep = () => {
  const formData = useFormManager((state) => state.formData)
  const saveFormData = useFormManager((state) => state.saveFormData)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FirstStepType>({
    mode: "onChange",
    resolver: zodResolver(firstStepSchema),
    defaultValues: {
      category: formData["first-step"].category || "",
    },
  })

  const onSubmit = (data: FirstStepType) => {
    console.log("data", data)
    saveFormData({ "first-step": { category: data.category } })
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
