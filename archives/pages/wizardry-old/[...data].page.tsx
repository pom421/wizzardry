import { useRouter } from "next/router"
import { useEffect } from "react"
import { mountStoreDevtool } from "simple-zustand-devtools"
import { useJobMarketStore } from "../../../src/store/user-data"

const WizardryPage = () => {
  const router = useRouter()

  const { label: url, component: Component } = useJobMarketStore((state) => state.currentStep)

  // const setPage = useJobMarketStore((state) => state.setPage)

  // const labelPage = Array.isArray(router.query.data) ? router.query.data[0] : router.query.data

  // const CurrentPage = userPages[url] || userPages["default"]

  // Sync the URL with the store.
  useEffect(() => {
    if (url !== router.asPath) {
      router.push(url)
    }
  }, [url, router])

  return (
    <>
      <h1>Wizardry</h1>

      {url}

      <Component />
    </>
  )
}

export default WizardryPage

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("useJobMarketStore", useJobMarketStore)
}
