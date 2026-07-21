import { useLocalStorage } from '@vueuse/core'

export const useSettings = () => {
  const windowTransparency = useLocalStorage('windowTransparency', false)
  const minimizeToTray = useStore('minimizeToTray', false)

  return { windowTransparency, minimizeToTray }
}
