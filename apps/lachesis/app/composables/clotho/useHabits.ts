import type { Data } from '@lepse/clotho/data'

export const useHabits = () => {
  const { $clotho } = useNuxtApp()
  const habits = useState<Data.Habit[]>('habits', () => [])

  const fetchHabits = async () => {
    const [payload, error] = await $clotho.api.habits.index({}).safe()
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

  const createHabit = async (body: Parameters<typeof $clotho.api.habits.store>['0']['body']) => {
    const [payload, error] = await $clotho.api.habits.store({ body }).safe()
    if (payload) {
      habits.value.push(payload.data)
    } else {
      console.error(error)
      return error
    }
  }

  const updateHabit = async (
    id: number,
    body: Parameters<typeof $clotho.api.habits.update>['0']['body']
  ) => {
    const [payload, error] = await $clotho.api.habits.update({ params: { id }, body }).safe()
    if (payload) {
      const index = habits.value.findIndex((h) => h.id === id)
      if (index !== -1) habits.value[index] = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  const destroyHabit = async (id: number) => {
    const [, error] = await $clotho.api.habits.destroy({ params: { id } }).safe()
    if (error) {
      console.error(error)
      return error
    }
    habits.value = habits.value.filter((h) => h.id !== id)
  }

  // ─── Returns ──────────────────────────────────────────────────────────────

  return { habits, fetchHabits, createHabit, updateHabit, destroyHabit }
}
