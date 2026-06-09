import { shallowRef } from 'vue'

type DialogOptions = {
  title?: string
  description?: string
  cancel?: string
  action?: string
}

export const activeDialog = shallowRef<
  | (DialogOptions & {
      resolve: (value: boolean) => void
    })
  | null
>(null)

export function dialog(options: DialogOptions) {
  if (activeDialog.value) return Promise.resolve(false)

  return new Promise<boolean>((resolve) => {
    activeDialog.value = {
      ...options,
      resolve,
    }
  })
}

export function closeDialog(value: boolean) {
  if (activeDialog.value) {
    activeDialog.value.resolve(value)
    activeDialog.value = null
  }
}
