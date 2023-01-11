import { useRouter } from "next/router";

export const Actions = ({ previous, next }: { previous?: string; next?: string }) => {
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
      <button onClick={() => router.push(next)} disabled={!next}>
        Next
      </button>
    </>
  )
}
