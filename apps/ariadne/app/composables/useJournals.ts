import type { Data } from '@lepse/minos/data'

export const useJournals = () => {
  const { $minos } = useNuxtApp()
  const journals = useState<Data.Journal[]>('journals', () => [])

  const fetchJournals = async () => {
    const [payload, error] = await $minos.api.journals.index({}).safe()
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
