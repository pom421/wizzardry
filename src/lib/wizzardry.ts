export type Step<FormData> = {
  label: string // The URL to set in the browser
  next?: (state: FormData) => string
  component: () => JSX.Element
}

export type UserFlow<FormData extends Record<string, Record<string, any>>> = Step<FormData>[]
