import type { Data } from '@lepse/minos/data'
import { getClientDate } from '~/lib/utils'

export const useDay = (date?: string) => {
  date = date ?? getClientDate()
  const { $minos } = useNuxtApp()
  const dayTasks = useState<Data.TaskDay[]>('dayTasks', () => [])
  const filteredDayTasks = computed(() => dayTasks.value.filter((dt) => dt.date?.startsWith(date)))

  const fetchDayTasks = async () => {
    const [payload, error] = await $minos.api.day.tasks
      .index({
        params: { date },
      })
      .safe()
    if (payload) {
      // Reload tasks of only the current date
      dayTasks.value = [...dayTasks.value.filter((dt) => dt.date !== date), ...payload.data]
    } else {
      console.error(error)
      return error
    }
  }

  if (filteredDayTasks.value.length === 0) {
    fetchDayTasks()
  }

  const createDayTask = async (
    body: Parameters<typeof $minos.api.day.tasks.store>['0']['body']
  ) => {
    console.log('doing')
    // Don't create if already exists for the same date
    if (dayTasks.value.some((dt) => dt.taskId === body.taskId && dt.date === date)) return
    console.log('doing')

    const [payload, error] = await $minos.api.day.tasks.store({ params: { date }, body }).safe()
    if (payload) {
      console.log(payload)
      dayTasks.value.push(payload.data)
    } else {
      console.error(error)
      return error
    }
  }

  const destroyDayTask = async (id: number) => {
    const [, error] = await $minos.api.day.tasks.destroy({ params: { date, id } }).safe()
    if (error) {
      console.error(error)
      return error
    }
    dayTasks.value = dayTasks.value.filter((t) => t.id !== id)
  }

  return { dayTasks: filteredDayTasks, fetchDayTasks, createDayTask, destroyDayTask }
}
