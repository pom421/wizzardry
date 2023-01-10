import { useRouter } from "next/router"
import { useEffect } from "react"
import { mountStoreDevtool } from "simple-zustand-devtools"
import { useJobMarketStore, userPages } from "../../store/user-data"

const WizardryPage = () => {
  const router = useRouter()

  const currentPage = useJobMarketStore((state) => state.currentPage)
  const setPage = useJobMarketStore((state) => state.setPage)

  const labelPage = Array.isArray(router.query.data) ? router.query.data[0] : router.query.data

  const CurrentPage = userPages[currentPage] || userPages["default"]

  useEffect(() => {
    if (labelPage !== currentPage) {
      setPage(labelPage)
    }
  }, [labelPage, currentPage, setPage])

  return (
    <>
      <h1>Wizardry</h1>

      {currentPage}

      {userPages[currentPage] && <CurrentPage />}
    </>
  )
}

export default WizardryPage

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("useJobMarketStore", useJobMarketStore)
}
