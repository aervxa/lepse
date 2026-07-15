import type { Data } from '@lepse/minos/data'

export const useFocusSessions = () => {
  const { $minos } = useNuxtApp()
  const focusSessions = useState<Data.FocusSession[]>('focusSessions', () => [])

  const fetchFocusSessions = async (date: string, frequency: 'daily' | 'weekly' | 'monthly') => {
    const [payload, error] = await $minos.api.focusSessions
      .index({
        query: { date, frequency },
      })
      .safe()

    if (payload) {
      // Reload sessions of only the fetched dates
      focusSessions.value = [
        ...focusSessions.value.filter((fs) => !payload.data.some((_fs) => _fs.date === fs.date)),
        ...payload.data,
      ]
    } else {
      console.error(error)
      return error
    }
  }

  return { focusSessions, fetchFocusSessions }
}
