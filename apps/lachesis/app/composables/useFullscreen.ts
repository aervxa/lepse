import { getCurrentWindow } from '@tauri-apps/api/window'
import { isTauri } from '@tauri-apps/api/core'
import { useFullscreen as useFullscreenBase } from '@vueuse/core'

export function useFullscreen(
  ...args: Parameters<typeof useFullscreenBase>
): ReturnType<typeof useFullscreenBase> {
  const base = useFullscreenBase(...args)

  async function enter() {
    if (isTauri()) {
      const win = getCurrentWindow()
      if (await win.isMaximized()) await win.unmaximize()
    }
    await base.enter()
  }

  async function toggle() {
    ;(base.isFullscreen.value ? base.exit : enter)()
  }

  return {
    ...base,
    enter,
    toggle,
  }
}
