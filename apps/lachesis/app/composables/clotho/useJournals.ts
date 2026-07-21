import type { Data } from '@lepse/clotho/data'

export const useJournals = () => {
  const { $clotho } = useNuxtApp()
  const journals = useState<Data.Journal[]>('journals', () => [])

  const fetchJournals = async () => {
    const [payload, error] = await $clotho.api.journals.index({}).safe()
    if (payload) {
      journals.value = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  if (journals.value.length === 0) {
    fetchJournals()
  }

  return { journals, fetchJournals }
}
