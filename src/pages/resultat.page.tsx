import { useEffect, useState } from "react"
import { z } from "zod"
import { readLSData } from "./constants"

import type { schemaFromResultat } from "../definition/schema"

const ResultatPage = () => {
  const [data, setData] = useState<z.infer<typeof schemaFromResultat> | undefined>(undefined)

  useEffect(() => {
    setData(readLSData())
  }, [])

  return (
    <>
      <h1>Résultat</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}

export default ResultatPage
