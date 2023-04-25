import { defaultValues as defaultValuesData, vanillaStoreFormData } from "../useFormData"
import { defaultValues as defaultValuesMeta, steps, vanillaStoreFormMeta } from "../useFormMeta"

describe("Tests on store handled by useFormData", () => {
  beforeEach(() => {
    vanillaStoreFormMeta.setState({ ...vanillaStoreFormMeta.getState(), formMeta: defaultValuesMeta }, true)
    vanillaStoreFormData.setState({ ...vanillaStoreFormData.getState(), formData: defaultValuesData }, true)
  })

  it("should return the default values", () => {
    const { getState } = vanillaStoreFormMeta
    expect(getState().formMeta).toEqual(defaultValuesMeta)
  })

  it("should show first step", () => {
    const { getState } = vanillaStoreFormMeta

    expect(steps[0]?.label).toEqual(getState()._firstStep())
  })

  it("should show last step", () => {
    const { getState } = vanillaStoreFormMeta

    expect(steps[steps?.length - 1]?.label).toEqual(getState()._finalStep())
  })

  it("should confirm a step", () => {
    const { getState } = vanillaStoreFormMeta

    const nameStep = steps[0]?.label

    if (!nameStep) throw new Error("The step does not exist.")

    expect(getState().formMeta[nameStep].status).toEqual("unconfirmed")

    getState().confirm(nameStep)

    expect(getState().formMeta[nameStep].status).toEqual("confirmed")
  })

  it("should unconfirm a step", () => {
    const { getState } = vanillaStoreFormMeta

    const nameStep = steps[0]?.label

    if (!nameStep) throw new Error("The step does not exist.")

    getState().confirm(nameStep)
    getState().unconfirm(nameStep)

    expect(getState().formMeta[nameStep].status).toEqual("unconfirmed")
  })

  it("should go to next step with condition", () => {
    const { getState: getData } = vanillaStoreFormData
    const { getState: getMeta } = vanillaStoreFormMeta

    getData().saveFormData({
      "home-step": {
        category: "recruiter",
      },
    })

    expect(getMeta().formMeta.currentStep).toEqual("home-step")

    getMeta().next()

    expect(getMeta().formMeta.currentStep).toEqual("recruiter-step")
  })

  it("should go to next step with condition 2", () => {
    const { getState: getData } = vanillaStoreFormData
    const { getState: getMeta } = vanillaStoreFormMeta

    getData().saveFormData({
      "home-step": {
        category: "worker",
      },
    })

    expect(getMeta().formMeta.currentStep).toEqual("home-step")

    getMeta().next()

    expect(getMeta().formMeta.currentStep).toEqual("worker-step")
  })
})
