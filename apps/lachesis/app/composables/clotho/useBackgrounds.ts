import type { Data } from '@lepse/clotho/data'
import { useDebounceFn } from '@vueuse/core'

export const useBackgrounds = () => {
  const { $clotho } = useNuxtApp()
  const { user, refreshUser } = useAuth()
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
    fetchBackgrounds().then(() => {
      const ids = backgrounds.value.map((bg) => bg.id)
      activeBackgroundId.value = ids[Math.floor(Math.random() * ids.length)]!
    })
  }

  const activeBackgroundId = useState<number | null>('activeBackgroundId', () => null)
  const activeBackgroundIdLock = useState('activeBackgroundIdLock', () => false)
  watch(
    user,
    () => {
      // prevents activeBackgroundId from being updated while selecting a background (incase smt else updates user, triggering this)
      if (!activeBackgroundIdLock.value && user.value?.backgroundId)
        activeBackgroundId.value = user.value?.backgroundId
    },
    { immediate: true }
  )

  const _select = useDebounceFn(
    async (body: Parameters<typeof $clotho.api.backgrounds.select>['0']['body']) => {
      const [, error] = await $clotho.api.backgrounds.select({ body }).safe()
      if (error) {
        activeBackgroundId.value = user.value?.backgroundId ?? null
        console.error(error)
        return error
      } else {
        await refreshUser()
      }
    },
    1000
  )
  const selectBackground = async (
    body: Parameters<typeof $clotho.api.backgrounds.select>['0']['body']
  ) => {
    activeBackgroundIdLock.value = true
    activeBackgroundId.value = Number(body.id)
    const error = await _select(body)
    activeBackgroundIdLock.value = false
    if (error) {
      return error
    }
  }

  return { backgrounds, fetchBackgrounds, activeBackgroundId, selectBackground }
}
