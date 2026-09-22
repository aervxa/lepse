import { useLocalStorage } from '@vueuse/core'
import { GREETINGS } from '~/lib/greetings'

export const useGreeting = () => {
  const now = useSharedNow()
  /**
   * Get period
   * hour 21 to next day's hour 3 is the last period
   * so, +3 to offset from the JS date's day and then `%4` to handle the overflow
   */
  const period = computed(() => Math.floor(((now.value.getHours() + 3) % 24) / 6) as 0 | 1 | 2 | 3)

  // date + period to hold for knowing if or when to refresh
  const date = ref('')
  watch(
    period,
    () => {
      date.value = now.value.getDate() + '|' + period.value
    },
    { immediate: true }
  )

  const getRandomPeriodly = () => ({
    date: date.value,
    greeting: pickRandom(GREETINGS[period.value]),
  })

  const periodlyGreeting = useLocalStorage<{ date: string; greeting: string }>(
    'periodly-greeting',
    getRandomPeriodly()
  )

  const reload = () => {
    if (periodlyGreeting.value.date !== date.value) {
      periodlyGreeting.value = getRandomPeriodly()
    }
  }

  reload() // initialize (incase of need to refresh an old one)
  watch(date, reload) // reload on every date change (refreshs every period, date refreshes on every period change)

  return { activeGreeting: computed(() => periodlyGreeting.value.greeting) }
}
