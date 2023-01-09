import { useRouter } from "next/router"
import { mountStoreDevtool } from "simple-zustand-devtools"
import { useJobMarketStore } from "../../store/user-data"

const WizardryPage = () => {
  const router = useRouter()

  const currentPage = useJobMarketStore((state) => state.currentPage)

  const labelPage = router.query.data

  return (
    <>
      <h1>Wizardry</h1>

      {labelPage}

      {currentPage}
    </>
  )
}

export default WizardryPage

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("useJobMarketStore", useJobMarketStore)
}
