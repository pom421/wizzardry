import { FieldError } from "react-hook-form"

/** Name of data in local storage */
export const LSName = "wizzardryData"

export function readLSData() {
  const data = window.localStorage.getItem(LSName)
  if (data) {
    return JSON.parse(data)
  }
  return {}
}

export function writeLSData(data: any) {
  const existingData = readLSData()
  window.localStorage.setItem(LSName, JSON.stringify({ ...existingData, ...data }))
}

export const formatErrors = (errors: Record<string, FieldError>) =>
  Object.keys(errors).map((key) => ({
    key,
    message: errors[key]?.message,
  }))
