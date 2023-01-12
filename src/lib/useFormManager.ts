import create from "zustand"
import { persist } from "zustand/middleware"
import { FlowStateType, initialFlowStateData } from "../configFlow/flowState"

type FormState = FlowStateType

type FormActions = {
  resetFormData: () => void
  saveFormData: (data: Partial<FormState>) => void
}

/**
 * Hook to get and handle the state of the form.
 *
 * @example
 * ```ts
 * const { formData, saveFormData, resetFormData } = useFormManager();
 * ```
 */
export const useFormManager = create<FormActions & { formData: FormState }>()(
  persist(
    (set, get) => ({
      formData: initialFlowStateData,
      saveFormData: (data: Partial<FormState>) => set({ formData: { ...get().formData, ...data } }),
      resetFormData: () =>
        set({
          formData: initialFlowStateData,
        }),
    }),
    {
      name: "store-form", // name of item in the storage (must be unique)
      getStorage: () => sessionStorage, // formData are removed when user is disconnected
    },
  ),
)
