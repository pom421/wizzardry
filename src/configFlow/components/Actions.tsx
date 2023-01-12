import { useRouter } from "next/router";
import { Position } from "../../pages/wizzardry/[[...step]].page";

type Props = { previous?: string; goNextStep?: () => void; position: Position }

export const Actions = ({ previous, goNextStep, position }: Props) => {
  const router = useRouter()
  // const url = useJobMarketStore((state) => state.url)
  // const nextPage = useJobMarketStore((state) => state.nextPage)
  // const previousPage = useJobMarketStore((state) => state.previousPage)

  return (
    <>
      {/* <pre>{JSON.stringify(router, null, 2)}</pre> */}

      <button onClick={() => router.push(previous)} disabled={position === "first"}>
        Previous
      </button>
      <button onClick={goNextStep} disabled={position === "final"}>
        Next
      </button>
    </>
  )
}
