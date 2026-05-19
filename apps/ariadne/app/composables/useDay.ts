import type { Data } from '@lepse/minos/data'
import { getClientDate } from '~/lib/utils'

export const useDay = (date?: string) => {
  date = date ?? getClientDate()
  const { $minos } = useNuxtApp()

  // ─── Tasks ────────────────────────────────────────────────────────────────

  const dayTasks = useState<Data.TaskDay[]>('dayTasks', () => [])
  const currentDayTasks = computed(() => dayTasks.value.filter((dt) => dt.date?.startsWith(date)))

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

  if (currentDayTasks.value.length === 0) {
    fetchDayTasks()
  }

  const createDayTask = async (
    body: Parameters<typeof $minos.api.day.tasks.store>['0']['body']
  ) => {
    // Don't create if already exists for the same date
    if (currentDayTasks.value.some((dt) => dt.taskId === body.taskId)) return

    const [payload, error] = await $minos.api.day.tasks.store({ params: { date }, body }).safe()
    if (payload) {
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
    dayTasks.value = dayTasks.value.filter((dt) => dt.id !== id)
  }

  const taskReturns = {
    dayTasks: currentDayTasks,
    fetchDayTasks,
    createDayTask,
    destroyDayTask,
  }

  // ─── Session ──────────────────────────────────────────────────────────────

  const focusSessions = useState<Data.FocusSession[]>('focusSessions', () => [])
  const currentFocusSession = computed(() =>
    focusSessions.value.find((fs) => fs.date?.startsWith(date))
  )

  const fetchFocusSession = async () => {
    const [payload, error] = await $minos.api.day.session
      .show({
        params: { date },
      })
      .safe()
    if (payload) {
      // Reload session of only the current date
      focusSessions.value = [
        ...focusSessions.value.filter((fs) => fs.date !== payload.data.date),
        payload.data,
      ]
    } else {
      // Ignore 404 due to session not existing until update
      if (error.isStatus(404)) {
        console.info("404 is expected since session won't exist until first update")
        return
      }
      console.error(error)
      return error
    }
  }

  const updateFocusSession = async (
    body: Parameters<typeof $minos.api.day.session.update>['0']['body']
  ) => {
    const [payload, error] = await $minos.api.day.session.update({ params: { date }, body }).safe()
    if (payload) {
      // Reload session of only the current date
      focusSessions.value = [
        ...focusSessions.value.filter((fs) => fs.date !== payload.data.date),
        payload.data,
      ]
    } else {
      console.error(error)
      return error
    }
  }

  const sessionReturns = {
    focusSession: currentFocusSession,
    fetchFocusSession,
    updateFocusSession,
  }

  // ─── Journal ──────────────────────────────────────────────────────────────

  const journals = useState<Data.Journal[]>('journalsByDay', () => [])
  const currentJournal = computed(() => journals.value.find((j) => j.date?.startsWith(date)))

  const fetchJournal = async () => {
    const [payload, error] = await $minos.api.day.journal
      .show({
        params: { date },
      })
      .safe()
    if (payload) {
      // Reload journal of only the current date
      journals.value = [...journals.value.filter((j) => j.date !== payload.data.date), payload.data]
    } else {
      // Ignore 404 due to journal not existing until update
      if (error.isStatus(404)) {
        console.info("404 is expected since journal won't exist until first update")
        return
      }
      console.error(error)
      return error
    }
  }

  const updateJournal = async (
    body: Parameters<typeof $minos.api.day.journal.update>['0']['body']
  ) => {
    const [payload, error] = await $minos.api.day.journal.update({ params: { date }, body }).safe()
    if (payload) {
      // Reload journal of only the current date
      journals.value = [...journals.value.filter((j) => j.date !== payload.data.date), payload.data]
    } else {
      console.error(error)
      return error
    }
  }

  const journalReturns = { journal: currentJournal, fetchJournal, updateJournal }

  // ─── Returns ──────────────────────────────────────────────────────────────

  return { ...taskReturns, ...sessionReturns, ...journalReturns }
}
