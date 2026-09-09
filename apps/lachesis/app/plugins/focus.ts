import { focusManager } from '@tanstack/vue-query'
import { isTauri } from '@tauri-apps/api/core'
import { listen, TauriEvent } from '@tauri-apps/api/event'

// tanstack's stock focus listener watches `visibilitychange` only, so the app
// window regaining native focus while it stays visible never revalidates. push
// that focus in, then hand detection straight back to the default.
export default defineNuxtPlugin({
  name: 'focus',
  setup() {
    if (!isTauri()) return
    listen(TauriEvent.WINDOW_FOCUS, () => {
      focusManager.setFocused(true)
      focusManager.setFocused(undefined)
    })
  },
})
