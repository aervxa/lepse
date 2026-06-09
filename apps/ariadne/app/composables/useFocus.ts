import { useLocalStorage } from '@vueuse/core'

export const useFocus = () => {
  const focusMethod = useLocalStorage<'stopwatch' | 'pomodoro'>('focus_method', 'stopwatch')
  const focusMethodToggleable = useState('focusMethodToggleable', () => true)

  const toggleFocusMethod = () => {
    focusMethod.value = focusMethod.value === 'stopwatch' ? 'pomodoro' : 'stopwatch'
  }

  return {
    focusMethod: readonly(focusMethod),
    focusMethodToggleable,
    toggleFocusMethod,
  }
}
