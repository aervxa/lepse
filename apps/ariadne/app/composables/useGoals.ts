import type { Data } from '@lepse/minos/data'

export const useGoals = () => {
  const { $minos } = useNuxtApp()
  const goals = useState<Data.Goal[]>('goals', () => [])

  const fetchGoals = async () => {
    const [payload, error] = await $minos.api.goals.index({}).safe()
    if (payload) {
      goals.value = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  const createGoal = async (body: Parameters<typeof $minos.api.goals.store>['0']['body']) => {
    const [payload, error] = await $minos.api.goals.store({ body }).safe()
    if (payload) {
      goals.value.push(payload.data)
    } else {
      console.error(error)
      return error
    }
  }

  const updateGoal = async (
    id: number,
    body: Parameters<typeof $minos.api.goals.update>['0']['body']
  ) => {
    const [payload, error] = await $minos.api.goals.update({ params: { id }, body }).safe()
    if (payload) {
      const index = goals.value.findIndex((g) => g.id === id)
      if (index !== -1) goals.value[index] = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  const destroyGoal = async (id: number) => {
    const [, error] = await $minos.api.goals.destroy({ params: { id } }).safe()
    if (error) {
      console.error(error)
      return error
    }
    goals.value = goals.value.filter((g) => g.id !== id)
  }

  return { goals, fetchGoals, createGoal, updateGoal, destroyGoal }
}
