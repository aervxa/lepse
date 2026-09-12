import { DEFAULT_BACKGROUND, NATURE_BACKGROUNDS } from '~/lib/backgrounds'

export const useBackgrounds = () => {
  const backgrounds: {
    id: number
    name: string
    style: string
    url: string
  }[] = [...NATURE_BACKGROUNDS]

  const selectedBackgroundId = useState('selected-background-id', () => DEFAULT_BACKGROUND.id)
  const activeBackground = computed(
    () => backgrounds.find((b) => b.id === selectedBackgroundId.value) ?? DEFAULT_BACKGROUND
  )

  console.log(backgrounds)
  console.log(activeBackground.value)

  return { backgrounds, activeBackground, selectedBackgroundId }
}
