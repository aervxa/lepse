import type { Data } from '@lepse/clotho/data'

export const useTasks = () => {
  const { $clotho } = useNuxtApp()
  const { user } = useAuth()
  const tasks = useState<Data.Task[]>('tasks', () => [])
  const focusedTaskId = useState<number | null>('focusedTaskId', () => null)

  const fetchTasks = async () => {
    const [payload, error] = await $clotho.api.tasks.index({}).safe()
    if (payload) {
      tasks.value = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  if (tasks.value.length === 0 && user.value?.emailVerified) {
    fetchTasks()
  }

  const createTask = async (body: Parameters<typeof $clotho.api.tasks.store>['0']['body']) => {
    const [payload, error] = await $clotho.api.tasks.store({ body }).safe()
    if (payload) {
      tasks.value.push(payload.data)
    } else {
      console.error(error)
      return error
    }
  }

  const updateTask = async (
    id: number,
    body: Parameters<typeof $clotho.api.tasks.update>['0']['body']
  ) => {
    const [payload, error] = await $clotho.api.tasks.update({ params: { id }, body }).safe()
    if (payload) {
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) tasks.value[index] = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  const destroyTask = async (id: number) => {
    const [, error] = await $clotho.api.tasks.destroy({ params: { id } }).safe()
    if (error) {
      console.error(error)
      return error
    }
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  return { tasks, focusedTaskId, fetchTasks, createTask, updateTask, destroyTask }
}
