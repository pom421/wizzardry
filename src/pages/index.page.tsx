import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push("/wizzardry/home-step")
  }, [])

  return (
    <div>
      Go to Wizzardry page : <Link href="/wizzardry/home-step">Wizzardry</Link>
    </div>
  )
}

export default Home
