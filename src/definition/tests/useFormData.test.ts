import { produce } from "immer"
import { defaultValues, vanillaStoreFormData } from "../useFormData"

describe("Tests on store handled by useFormData", () => {
  beforeEach(() => {
    vanillaStoreFormData.setState({ ...vanillaStoreFormData.getState(), formData: defaultValues }, true)
  })

  it("should return the default values", () => {
    const { getState } = vanillaStoreFormData
    expect(getState().formData).toEqual(defaultValues)
  })

  it("should save a portion of data", () => {
    const { getState } = vanillaStoreFormData

    getState().saveFormData({
      "home-step": {
        category: "recruiter",
      },
    })

    const expectedState = produce(defaultValues, (draft) => {
      draft["home-step"].category = "recruiter"
    })

    expect(getState().formData).toEqual(expectedState)
  })

  it("should reset the form data after a first update", () => {
    const { getState } = vanillaStoreFormData

    getState().saveFormData({
      "home-step": {
        category: "recruiter",
      },
    })

    getState().resetFormData()

    expect(getState().formData).toEqual(defaultValues)
  })
})
