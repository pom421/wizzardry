import type { NextPage } from "next"
import Link from "next/link"

const Home: NextPage = () => {
  return (
    <div>
      Go to Wizzardry page : <Link href="/wizzardry/first-step">Wizzardry</Link>
    </div>
  )
}

export default Home
