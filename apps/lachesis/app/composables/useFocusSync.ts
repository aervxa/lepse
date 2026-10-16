import { emitTo, listen, type UnlistenFn } from '@tauri-apps/api/event'
import { isTauri } from '@tauri-apps/api/core'
import { useEventBus, type EventBusKey } from '@vueuse/core'

type UpdateOptions = {
  stopwatchMs?: number
  pomoCount?: number
}

type SessionPayload = { options: UpdateOptions }
type TaskPayload = { id: number; options: UpdateOptions }

const UPDATE_SESSION = 'focus:update-session'
const UPDATE_TASK = 'focus:update-task'
const sessionKey: EventBusKey<SessionPayload> = Symbol(UPDATE_SESSION)
const taskKey: EventBusKey<TaskPayload> = Symbol(UPDATE_TASK)

export const useFocusSyncClient = (popout?: boolean) => {
  const sessionBus = useEventBus(sessionKey)
  const taskBus = useEventBus(taskKey)

  const updateSession = (options: SessionPayload['options']) => {
    console.log(`[clock-focus:client] emitting ${UPDATE_SESSION} ...`)
    if (!popout) {
      sessionBus.emit({ options })
    } else if (isTauri()) {
      emitTo<SessionPayload>('main', UPDATE_SESSION, { options })
    }
  }

  const updateTask = (id: TaskPayload['id'], options: TaskPayload['options']) => {
    console.log(`[clock-focus:client] emitting ${UPDATE_TASK} ...`)
    if (!popout) {
      taskBus.emit({ id, options })
    } else if (isTauri()) {
      emitTo<TaskPayload>('main', UPDATE_TASK, { id, options })
    }
  }

  return { updateSession, updateTask }
}

export const useFocusSyncServer = () => {
  const date = getClientDate()
  const { updateFocusSessionMutation } = useDay(date)
  const { updateTaskMutation } = useTasks()

  const updateSession = ({ options }: SessionPayload) => {
    console.log(`[clock-focus:server] heard ${UPDATE_SESSION}, updating session...`)
    updateFocusSessionMutation.mutate({
      params: { date },
      body: options,
    })
  }

  const updateTask = ({ id, options }: TaskPayload) => {
    console.log(`[clock-focus:server] heard ${UPDATE_TASK}, updating task...`)
    updateTaskMutation.mutate({ params: { id }, body: options })
  }

  // vueuse auto unlistens when called in setup
  useEventBus(sessionKey).on(updateSession)
  useEventBus(taskKey).on(updateTask)

  let unlistenSession: UnlistenFn
  let unlistenTask: UnlistenFn
  onMounted(async () => {
    // Set listeners to run syncs when popout send emits
    if (isTauri()) {
      unlistenSession = await listen<SessionPayload>(UPDATE_SESSION, ({ payload }) =>
        updateSession(payload)
      )
      unlistenTask = await listen<TaskPayload>(UPDATE_TASK, ({ payload }) => updateTask(payload))
    }
  })
  onUnmounted(() => {
    unlistenSession?.()
    unlistenTask?.()
  })
}
