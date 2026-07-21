import type { Data } from '@lepse/clotho/data'

export const useHabit = (id: number) => {
  const { $clotho } = useNuxtApp()

  // ─── Habit ────────────────────────────────────────────────────────────────

  const habits = useState<Data.Habit[]>('habits', () => [])
  const habit = computed(() => habits.value.find((habit) => habit.id === id))

  const fetchHabit = async () => {
    const [payload, error] = await $clotho.api.habits.show({ params: { id } }).safe()

    if (payload) {
      const index = habits.value.findIndex((h) => h.id === id)
      if (index !== -1) habits.value[index] = payload.data
      else habits.value.push(payload.data)
      return
    } else {
      console.error(error)
      return error
    }
  }

  if (id > 0 && !habit.value) {
    fetchHabit()
  }

  const habitReturns = { habit, fetchHabit }

  // ─── Habit Period ────────────────────────────────────────────────────────

  const habitPeriods = useState<Data.HabitPeriod[]>('habitPeriods', () => [])
  const habitPeriod = computed(() => habitPeriods.value.find((period) => period.habitId === id))

  const $updateOrCreateHabitPeriod = async (habitPeriod: Data.HabitPeriod) => {
    const index = habitPeriods.value.findIndex((hp) => hp.id === habitPeriod.id)
    if (index !== -1) habitPeriods.value[index] = habitPeriod
    else habitPeriods.value.push(habitPeriod)
  }

  const fetchHabitPeriod = async (date?: string) => {
    const [payload, error] = await $clotho.api.habits
      .count({
        params: { id },
        query: { date },
      })
      .safe()

    if (payload) {
      $updateOrCreateHabitPeriod(payload.data)
    } else {
      // Ignore 404 due to habit period not existing until update
      if (error.isStatus(404)) {
        console.info("404 is expected since habit period won't exist until first update")
        return
      }
      console.error(error)
      return error
    }
  }

  const incrementHabit = async () => {
    const [payload, error] = await $clotho.api.habits.increment({ params: { id } }).safe()
    if (payload) {
      $updateOrCreateHabitPeriod(payload.data)
    } else {
      console.error(error)
      return error
    }
  }

  const decrementHabit = async () => {
    const [payload, error] = await $clotho.api.habits.decrement({ params: { id } }).safe()
    if (payload) {
      $updateOrCreateHabitPeriod(payload.data)
    } else {
      console.error(error)
      return error
    }
  }

  const habitPeriodReturns = {
    habitPeriod,
    habitPeriods,
    fetchHabitPeriod,
    incrementHabit,
    decrementHabit,
  }

  // ─── Returns ──────────────────────────────────────────────────────────────

  return { ...habitReturns, ...habitPeriodReturns }
}
