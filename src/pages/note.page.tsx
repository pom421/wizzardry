import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Label } from "../components/Label"
import { pageEmailSchema } from "../definition/schema"
import { formatErrors, readLSData, writeLSData } from "./constants"

const NotePage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof pageEmailSchema>>({
    resolver: zodResolver(pageEmailSchema),
    defaultValues: {
      email: "john.maclane@gmail.com",
    },
  })
  const router = useRouter()

  useEffect(() => {
    console.log("readLSData", readLSData())
  })

  function onSubmit(data: z.infer<typeof pageEmailSchema>) {
    console.log(data)

    writeLSData(data)

    router.push("/resultat")
  }

  return (
    <>
      <h1>Email</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <Label htmlFor="email">Email</Label>
            <input id="email" {...register("email")} />
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

export default NotePage
