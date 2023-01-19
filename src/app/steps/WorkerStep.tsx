import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useWizzardryManager } from "../../pages/wizzardry/[[...step]].page"
import { AlertInput } from "../components/AlertInput"

export const workerStepSchema = z.object({
  name: z.string().min(1),
  favoriteSkill: z.string().min(1),
})

type WorkerStepType = z.infer<typeof workerStepSchema>

export const WorkerStep = () => {
  const formData = useWizzardryManager((state) => state.formData)
  const saveFormData = useWizzardryManager((state) => state.saveFormData)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<WorkerStepType>({
    mode: "onChange",
    resolver: zodResolver(workerStepSchema),
    defaultValues: {
      name: formData["worker-step"].name || "",
      favoriteSkill: formData["worker-step"].favoriteSkill || "",
    },
  })

  const onSubmit = (data: WorkerStepType) => {
    console.log("data", data)
    saveFormData({ "worker-step": { name: data.name, favoriteSkill: data.favoriteSkill } })
  }

  return (
    <>
      <h1>Worker Step</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", maxWidth: 600 }}
        noValidate
      >
        <input {...register("name")} aria-invalid={Boolean(errors.name)} placeholder="First name" />

        <AlertInput>{errors?.name?.message}</AlertInput>

        <input
          {...register("favoriteSkill")}
          aria-invalid={Boolean(errors.favoriteSkill)}
          placeholder="What is you best skill ?"
        />

        <AlertInput>{errors?.favoriteSkill?.message}</AlertInput>

        <input type="submit" disabled={isSubmitting || !isValid} />
      </form>
    </>
  )
}
