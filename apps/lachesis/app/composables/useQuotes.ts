import { useLocalStorage } from '@vueuse/core'
import { QUOTES } from '~/lib/quotes'

export const useQuotes = () => {
  const now = useSharedNow()
  const today = computed(() => now.value.toDateString())

  const getRandomDaily = () => ({ date: today.value, quote: pickRandom(QUOTES) })

  const dailyQuote = useLocalStorage<{ date: string; quote: (typeof QUOTES)[number] }>(
    'daily-quote',
    getRandomDaily()
  )

  const reload = () => {
    if (dailyQuote.value.date !== today.value) {
      dailyQuote.value = getRandomDaily()
    }
  }

  reload() // initialize (incase of need to refresh an old one)
  watch(today, reload) // reload the quote on every date change (refreshs every days)

  return { activeQuote: computed(() => dailyQuote.value.quote) }
}
