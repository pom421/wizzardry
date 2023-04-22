import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Label } from "../components/Label"
import { pageSmsSchema } from "../definition/schema"
import { formatErrors, readLSData, writeLSData } from "./constants"

const SmsPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof pageSmsSchema>>({
    resolver: zodResolver(pageSmsSchema),
    defaultValues: {
      phone: "020202020202",
    },
  })
  const router = useRouter()

  useEffect(() => {
    console.log("readLSData", readLSData())
  })

  function onSubmit(data: z.infer<typeof pageSmsSchema>) {
    console.log(data)

    writeLSData(data)

    router.push("/resultat")
  }

  return (
    <>
      <h1>Sms</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <Label htmlFor="phone">N° téléphone</Label>
            <input id="phone" {...register("phone")} />
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

export default SmsPage
