import type { Data } from '@lepse/clotho/data'

export const useBackgrounds = () => {
  const { $clotho } = useNuxtApp()
  const { refreshUser } = useAuth()
  const backgrounds = useState<Data.Background[]>('backgrounds', () => [])

  const fetchBackgrounds = async () => {
    const [payload, error] = await $clotho.api.backgrounds.index({}).safe()
    if (payload) {
      backgrounds.value = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  if (backgrounds.value.length === 0) {
    fetchBackgrounds()
  }

  const selectBackground = async (
    body: Parameters<typeof $clotho.api.backgrounds.select>['0']['body']
  ) => {
    const [, error] = await $clotho.api.backgrounds.select({ body }).safe()
    if (error) {
      console.error(error)
      return error
    } else {
      refreshUser()
    }
  }

  return { backgrounds, fetchBackgrounds, selectBackground }
}
