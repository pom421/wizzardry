import { useRouter } from "next/router";

type Props = { previous?: string; goNextStep?: () => void }

export const Actions = ({ previous, goNextStep }: Props) => {
  const router = useRouter()
  // const url = useJobMarketStore((state) => state.url)
  // const nextPage = useJobMarketStore((state) => state.nextPage)
  // const previousPage = useJobMarketStore((state) => state.previousPage)

  return (
    <>
      {/* <pre>{JSON.stringify(router, null, 2)}</pre> */}

      <button onClick={() => router.push(previous)} disabled={!previous}>
        Previous
      </button>
      <button onClick={goNextStep} disabled={!goNextStep}>
        Next
      </button>
    </>
  )
}
