import type { Data } from '@lepse/minos/data'

export const useTasks = () => {
  const { $minos } = useNuxtApp()
  const tasks = useState<Data.Task[]>('tasks', () => [])

  const fetchTasks = async () => {
    const [payload, error] = await $minos.api.tasks.index({}).safe()
    if (payload) {
      tasks.value = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  const createTask = async (body: Parameters<typeof $minos.api.tasks.store>['0']['body']) => {
    const [payload, error] = await $minos.api.tasks.store({ body }).safe()
    if (payload) {
      tasks.value.push(payload.data)
    } else {
      console.error(error)
      return error
    }
  }

  const updateTask = async (
    id: number,
    body: Parameters<typeof $minos.api.tasks.update>['0']['body']
  ) => {
    const [payload, error] = await $minos.api.tasks.update({ params: { id }, body }).safe()
    if (payload) {
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) tasks.value[index] = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  const destroyTask = async (id: number) => {
    const [, error] = await $minos.api.tasks.destroy({ params: { id } }).safe()
    if (error) {
      console.error(error)
      return error
    }
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  return { tasks, fetchTasks, createTask, updateTask, destroyTask }
}
