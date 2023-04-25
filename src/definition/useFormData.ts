import { createStore, useStore } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { Definition } from "./schema"

type Actions = {
  resetFormData: () => void
  saveFormData: (data: Partial<Definition>) => void
}

export const defaultValues: Definition = {
  "home-step": {
    category: "recruiter",
  },
  "recruiter-step": {
    company: "",
    searchedSkill: "",
  },
  "worker-step": {
    name: "",
    favoriteSkill: "",
  },
  "confirmation-step": {
    message: "",
  },
}

/**
 * Vanilla store to handle the form data.
 *
 * @example
 * ```ts
 * const { getState, setState, subscribe, destroy } = vanillaStoreFormData
 * ```
 */
export const vanillaStoreFormData = createStore<Actions & { formData: Definition }>()(
  persist(
    immer((set) => ({
      formData: defaultValues,
      saveFormData: (data: Partial<Definition>) => {
        set((state) => {
          state.formData = { ...state.formData, ...data }
        })
      },
      resetFormData: () =>
        set({
          formData: defaultValues,
        }),
    })),
    {
      name: "wizzardry-form",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

/**
 * Hook to get and handle the state of the form.
 *
 * @example
 * ```ts
 * const { formData, saveFormData, resetFormData } = useFormData();
 * ```
 */
export const useFormData = (selector: (state: Actions & { formData: Definition }) => unknown) =>
  useStore(vanillaStoreFormData, selector)
