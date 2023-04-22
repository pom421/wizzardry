import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { Definition } from "./schema"

type Actions = {
  resetFormData: () => void
  saveFormData: (data: Partial<Definition>) => void
}

const defaultValues: Definition = {
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
 * Hook to get and handle the state of the form.
 *
 * @example
 * ```ts
 * const { formData, saveFormData, resetFormData } = useFormData();
 * ```
 */
export const useFormData = create<Actions & { formData: Definition }>()(
  persist(
    (set, get) => ({
      formData: defaultValues,
      saveFormData: (data: Partial<Definition>) => set({ formData: { ...get().formData, ...data } }),
      resetFormData: () =>
        set({
          formData: defaultValues,
        }),
    }),
    {
      name: "wizzardry-form",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
