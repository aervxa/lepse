import { isTauri } from '@tauri-apps/api/core'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { createSharedComposable, useFullscreen as VuseFullscreen } from '@vueuse/core'

const internal_useFullscreen = () => {
  if (isTauri()) {
    const isFullscreen = ref(false)
    const toggle = (force?: boolean) => {
      isFullscreen.value = force ?? !isFullscreen.value
      getCurrentWebviewWindow().setFullscreen(isFullscreen.value)
    }
    return {
      isSupported: true,
      isFullscreen,
      toggle: toggle.bind(this, undefined),
      enter: toggle.bind(this, true),
      exit: toggle.bind(this, false),
    }
  } else {
    const { isSupported, isFullscreen, toggle, enter, exit } = VuseFullscreen()
    return { isSupported, isFullscreen, toggle, enter, exit }
  }
}

export const useFullscreen = createSharedComposable(internal_useFullscreen)
