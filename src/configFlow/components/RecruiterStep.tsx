import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertInput } from "../../components/AlertInput"
import { useFormManager } from "../../lib/useFormManager"

export const recruiterStepSchema = z.object({
  company: z.string().min(1),
  searchedSkill: z.string().min(1),
})

type RecruiterStepType = z.infer<typeof recruiterStepSchema>

export const RecruiterStep = () => {
  const formData = useFormManager((state) => state.formData)
  const saveFormData = useFormManager((state) => state.saveFormData)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RecruiterStepType>({
    mode: "onChange",
    resolver: zodResolver(recruiterStepSchema),
    defaultValues: {
      company: formData["recruiter-step"].company || "",
      searchedSkill: formData["recruiter-step"].searchedSkill || "",
    },
  })

  const onSubmit = (data: RecruiterStepType) => {
    console.log("data", data)
    saveFormData({ "recruiter-step": { company: data.company, searchedSkill: data.searchedSkill } })
  }

  return (
    <>
      <h1>Recruiter Step</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", maxWidth: 600 }}
        noValidate
      >
        <input {...register("company")} aria-invalid={Boolean(errors.company)} placeholder="Company" />

        <AlertInput>{errors?.company?.message}</AlertInput>

        <input
          {...register("searchedSkill")}
          aria-invalid={Boolean(errors.searchedSkill)}
          placeholder="What skill are you looking for ?"
        />

        <AlertInput>{errors?.searchedSkill?.message}</AlertInput>

        <input type="submit" disabled={isSubmitting || !isValid} />
      </form>
    </>
  )
}
