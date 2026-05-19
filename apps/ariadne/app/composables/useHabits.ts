import type { Data } from '@lepse/minos/data'

export const useHabits = () => {
  const { $minos } = useNuxtApp()

  // ─── Habits ───────────────────────────────────────────────────────────────

  const habits = useState<Data.Habit[]>('habits', () => [])

  const fetchHabits = async () => {
    const [payload, error] = await $minos.api.habits.index({}).safe()
    if (payload) {
      habits.value = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  if (habits.value.length === 0) {
    fetchHabits()
  }

  const createHabit = async (body: Parameters<typeof $minos.api.habits.store>['0']['body']) => {
    const [payload, error] = await $minos.api.habits.store({ body }).safe()
    if (payload) {
      habits.value.push(payload.data)
    } else {
      console.error(error)
      return error
    }
  }

  const updateHabit = async (
    id: number,
    body: Parameters<typeof $minos.api.habits.update>['0']['body']
  ) => {
    const [payload, error] = await $minos.api.habits.update({ params: { id }, body }).safe()
    if (payload) {
      const index = habits.value.findIndex((h) => h.id === id)
      if (index !== -1) habits.value[index] = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  const destroyHabit = async (id: number) => {
    const [, error] = await $minos.api.habits.destroy({ params: { id } }).safe()
    if (error) {
      console.error(error)
      return error
    }
    habits.value = habits.value.filter((h) => h.id !== id)
  }

  const habitReturns = { habits, fetchHabits, createHabit, updateHabit, destroyHabit }

  // ─── Habit Periods ────────────────────────────────────────────────────────

  const habitPeriods = useState<Data.HabitPeriod[]>('habitPeriods', () => [])

  const $updateOrCreateHabitPeriod = async (habitPeriod: Data.HabitPeriod) => {
    const index = habitPeriods.value.findIndex((hp) => hp.id === habitPeriod.id)
    if (index !== -1) habitPeriods.value[index] = habitPeriod
    else habitPeriods.value.push(habitPeriod)
  }

  const fetchHabitPeriod = async (id: number) => {
    const [payload, error] = await $minos.api.habits.count({ params: { id } }).safe()
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

  const incrementHabit = async (id: number) => {
    const [payload, error] = await $minos.api.habits.increment({ params: { id } }).safe()
    if (payload) {
      $updateOrCreateHabitPeriod(payload.data)
    } else {
      console.error(error)
      return error
    }
  }

  const decrementHabit = async (id: number) => {
    const [payload, error] = await $minos.api.habits.decrement({ params: { id } }).safe()
    if (payload) {
      $updateOrCreateHabitPeriod(payload.data)
    } else {
      console.error(error)
      return error
    }
  }

  const habitPeriodReturns = { habitPeriods, fetchHabitPeriod, incrementHabit, decrementHabit }

  // ─── Returns ──────────────────────────────────────────────────────────────

  return { ...habitReturns, ...habitPeriodReturns }
}
