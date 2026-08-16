import { getCurrentWindow } from '@tauri-apps/api/window'
import { invoke, isTauri } from '@tauri-apps/api/core'
import { useFullscreen as useFullscreenBase } from '@vueuse/core'

const isTauriFullscreen = ref(false)
let isInitialized = false

export function useFullscreen(
  ...args: Parameters<typeof useFullscreenBase>
): ReturnType<typeof useFullscreenBase> {
  if (!isTauri()) {
    return useFullscreenBase(...args)
  }

  if (import.meta.client && !isInitialized) {
    isInitialized = true
    invoke<boolean>('is_fullscreen')
      .then((fs) => {
        isTauriFullscreen.value = fs
      })
      .catch(() => {})

    getCurrentWindow().onResized(async () => {
      try {
        isTauriFullscreen.value = await invoke<boolean>('is_fullscreen')
      } catch {}
    })
  }

  async function enter() {
    try {
      const res = await invoke<boolean>('set_fullscreen', { fullscreen: true })
      isTauriFullscreen.value = res
    } catch {
      await getCurrentWindow().setFullscreen(true)
      isTauriFullscreen.value = true
    }
  }

  async function exit() {
    try {
      const res = await invoke<boolean>('set_fullscreen', { fullscreen: false })
      isTauriFullscreen.value = res
    } catch {
      await getCurrentWindow().setFullscreen(false)
      isTauriFullscreen.value = false
    }
  }

  async function toggle() {
    try {
      const res = await invoke<boolean>('toggle_fullscreen')
      isTauriFullscreen.value = res
    } catch {
      const next = !isTauriFullscreen.value
      await getCurrentWindow().setFullscreen(next)
      isTauriFullscreen.value = next
    }
  }

  return {
    isFullscreen: isTauriFullscreen,
    isSupported: ref(true),
    enter,
    exit,
    toggle,
  } as unknown as ReturnType<typeof useFullscreenBase>
}