import type { Data } from '@lepse/clotho/data'

export const useGoals = () => {
  const { $clotho } = useNuxtApp()
  const goals = useState<Data.Goal[]>('goals', () => [])

  const fetchGoals = async () => {
    const [payload, error] = await $clotho.api.goals.index({}).safe()
    if (payload) {
      goals.value = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  if (goals.value.length === 0) {
    fetchGoals()
  }

  const createGoal = async (body: Parameters<typeof $clotho.api.goals.store>['0']['body']) => {
    const [payload, error] = await $clotho.api.goals.store({ body }).safe()
    if (payload) {
      goals.value.push(payload.data)
    } else {
      console.error(error)
      return error
    }
  }

  const updateGoal = async (
    id: number,
    body: Parameters<typeof $clotho.api.goals.update>['0']['body']
  ) => {
    const [payload, error] = await $clotho.api.goals.update({ params: { id }, body }).safe()
    if (payload) {
      const index = goals.value.findIndex((g) => g.id === id)
      if (index !== -1) goals.value[index] = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  const destroyGoal = async (id: number) => {
    const [, error] = await $clotho.api.goals.destroy({ params: { id } }).safe()
    if (error) {
      console.error(error)
      return error
    }
    goals.value = goals.value.filter((g) => g.id !== id)
  }

  return { goals, fetchGoals, createGoal, updateGoal, destroyGoal }
}
