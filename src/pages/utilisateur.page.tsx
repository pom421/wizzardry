import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Label } from "../components/Label"
import { pageUserSchema } from "../definition/schema"
import { formatErrors, readLSData, writeLSData } from "./constants"

const UserPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof pageUserSchema>>({
    resolver: zodResolver(pageUserSchema),
    defaultValues: {
      firstName: "john",
      preference: "email",
    },
  })
  const router = useRouter()

  useEffect(() => {
    console.log("readLSData", readLSData())
  })

  function onSubmit(data: z.infer<typeof pageUserSchema>) {
    console.log(data)

    writeLSData(data)

    if (data.preference === "email") {
      return router.push("/email")
    }

    router.push("/sms")
  }

  return (
    <>
      <h1>Informations utilisateur</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <Label htmlFor="firstName">Nom</Label>
            <input id="firstName" {...register("firstName")} />
          </div>
          <div>
            <Label htmlFor="preference">Préférence</Label>
            <select {...register("preference")}>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          <button style={{ maxWidth: "max-content" }}>OK</button>
        </div>
      </form>

      <hr />
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
      <pre>{JSON.stringify(formatErrors(errors), null, 2)}</pre>
    </>
  )
}

export default UserPage
