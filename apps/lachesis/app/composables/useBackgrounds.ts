import { useLocalStorage } from '@vueuse/core'
import { BACKGROUNDS } from '~/lib/backgrounds'

const DEFAULT_BACKGROUND_ID = 5672 /* green-lines */

export const useBackgrounds = () => {
  const selectedBackgroundId = useLocalStorage<number>(
    'selected-background-id',
    DEFAULT_BACKGROUND_ID
  )
  const activeBackground = computed(() =>
    BACKGROUNDS.find((b) => b.id === (selectedBackgroundId.value || DEFAULT_BACKGROUND_ID))!
  )

  return { activeBackground, selectedBackgroundId }
}
