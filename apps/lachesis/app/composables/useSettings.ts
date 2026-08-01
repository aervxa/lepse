import { useLocalStorage } from '@vueuse/core'

export const useSettings = () => {
  // Appearance settings
  const THEMES = [
    'white',
    'beige',
    'red',
    'amber',
    'yellow',
    'lime',
    'green',
    'teal',
    'cyan',
    'blue',
    'indigo',
    'violet',
    'magenta',
    'rose',
    'espresso',
  ] as const
  const theme = useLocalStorage<(typeof THEMES)[number]>(
    'theme',
    THEMES[Math.floor(Math.random() * THEMES.length)]!
  )

  const appearanceSettings = { THEMES, theme }

  // App settings
  const windowTransparency = useLocalStorage('windowTransparency', false)
  const nativeDecorations = useStore('nativeDecorations', false)
  const minimizeToTray = useStore('minimizeToTray', false)

  const appSettings = { windowTransparency, nativeDecorations, minimizeToTray }

  return { ...appearanceSettings, ...appSettings }
}
