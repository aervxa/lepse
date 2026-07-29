import { useLocalStorage } from '@vueuse/core'

export const useSettings = () => {
  const windowTransparency = useLocalStorage('windowTransparency', false)
  const nativeDecorations = useStore('nativeDecorations', false)
  const minimizeToTray = useStore('minimizeToTray', false)

  return { windowTransparency, nativeDecorations, minimizeToTray }
}
