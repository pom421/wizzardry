import { useRouter } from "next/router"
import type { PositionInFlow } from "../../lib/useStep"

type Props = { previous?: string; goNextStep?: () => void; positionInFlow: PositionInFlow }

export const Actions = ({ previous, goNextStep, positionInFlow }: Props) => {
  const router = useRouter()

  // const url = useJobMarketStore((state) => state.url)
  // const nextPage = useJobMarketStore((state) => state.nextPage)
  // const previousPage = useJobMarketStore((state) => state.previousPage)

  return (
    <>
      {/* <pre>{JSON.stringify(router, null, 2)}</pre> */}

      <button onClick={() => router.push(previous)} disabled={positionInFlow === "first"}>
        Previous
      </button>
      <button onClick={goNextStep} disabled={positionInFlow === "final"}>
        Next
      </button>
    </>
  )
}
