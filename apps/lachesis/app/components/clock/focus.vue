<script setup lang="ts">
import { useDebounceFn, useIntervalFn, useLocalStorage } from '@vueuse/core'
import { ChevronsUpDown, FastForward, Pause, Play, RefreshCw, X } from '@lucide/vue'
import { formatDuration, Stopwatch } from '~/lib/time'
import { toBreakMessages, toLongBreakMessages, toWorkMessages } from '~/lib/pomoMessages'

const { popout } = defineProps<{ popout?: boolean }>()

const { send, requestPermission } = useNotification(false)
const { user } = useAuth()

const date = getClientDate()
const { focusSession, updateFocusSessionMutation } = useDay(date)

// ─── Focus ──────────────────────────────────────────────────────────────────

const focusMethod = useLocalStorage<'stopwatch' | 'pomodoro'>('focus_method', 'stopwatch')
const focusMethodToggleable = ref(true)
const focusDirty = ref(false)
const toggleFocusMethod = () => {
  const r = () => (focusMethod.value = focusMethod.value === 'stopwatch' ? 'pomodoro' : 'stopwatch')
  if (focusDirty.value) {
    dialog({ title: 'Are you sure?', description: 'Switching will reset your timer.' }).then(
      (v) => v && r()
    )
  } else {
    r()
  }
}

// ─── Task ───────────────────────────────────────────────────────────────────

const { tasks, focusedTaskId, updateTaskMutation, createTaskMutation } = useTasks()
const task = computed(() => tasks.value?.find((t) => t.id === focusedTaskId.value))

const selectTask = (id: number) => {
  // fn SHOULD change focusedTaskId
  const r = () => {
    focusedTaskId.value = id
  }
  if (focusDirty.value && focusedTaskId.value !== -1) {
    dialog({
      title: 'Are you sure?',
      description:
        id > -1
          ? 'Switching will carry over your progress to the new task.'
          : 'Cancelling will result in your progress being lost.',
    }).then((v) => {
      if (v) {
        if (focusMethod.value === 'stopwatch' && task.value) {
          // remove from old task
          updateTaskMutation.mutate({
            params: { id: task.value.id },
            body: { stopwatchMs: Math.round(task.value.stopwatchMs - stopwatchSyncedMs) },
          })
          r() // update `task`
          // If user is not cancelling, add to new task
          if (id > -1) {
            updateTaskMutation.mutate({
              params: { id: task.value.id },
              body: { stopwatchMs: Math.round(task.value.stopwatchMs + stopwatchSyncedMs) },
            })
          } else {
            // If user cancels, reset stopwatch
            stopwatch.reset()
          }
          stopwatchSyncedMs = 0
        } else {
          r()
        }
      }
    })
  } else {
    r()
  }
}

const createNewTask = async (search: string) =>
  createTaskMutation.mutateAsync(
    { body: { name: search } },
    {
      onError: (err) => toast.error('Failed to create task!', { description: err.message }),
    }
  )

// ─── Shared stopwatch class ─────────────────────────────────────────────────

const stopwatch = new Stopwatch({
  onStart: () => {
    if (focusMethod.value === 'stopwatch') stopwatchSyncInterval.resume()
    focusDirty && (focusDirty.value = true)
    if (focusMethod.value === 'pomodoro') requestPermission()
  },
  onStop: () => {
    if (focusMethod.value === 'stopwatch') {
      syncStopwatch()
      stopwatchSyncInterval.pause()
      focusDirty && (focusDirty.value = false) // not dirty since progress synced
    }
  },
  onReset: () => {
    focusDirty && (focusDirty.value = false)
  },
})

const formatted = computed(() => {
  if (focusMethod.value === 'stopwatch') {
    return formatDuration(stopwatch.elapsed.value)
  } else if (focusMethod.value === 'pomodoro') {
    const pomoElapsed = pomoStateDuration.value - stopwatch.elapsed.value
    return formatDuration(pomoElapsed, { format: 'mm:ss' })
  } else {
    return ''
  }
})

// Update focusMethodToggleable when stopwatch running state changes
watch(
  stopwatch.running,
  () => {
    if (focusMethodToggleable) focusMethodToggleable.value = !stopwatch.running.value
  },
  { immediate: true }
)
// Reset stopwatch (the global stopwatch) when focusMethod changes
watch(focusMethod, () => {
  stopwatch.reset()
})

// ─── Stopwatch ──────────────────────────────────────────────────────────────

let stopwatchSyncedMs = 0
const syncStopwatch = useDebounceFn(() => {
  const elapsed = stopwatch.elapsed.value

  // Update focus session's stopwatchMs
  updateFocusSessionMutation.mutate({
    params: { date },
    body: {
      stopwatchMs: Math.round(
        (focusSession.value?.stopwatchMs ?? 0) + (elapsed - stopwatchSyncedMs)
      ),
    },
  })
  // Update selected task
  if (task.value)
    updateTaskMutation.mutate({
      params: { id: task.value.id },
      body: { stopwatchMs: Math.round(task.value.stopwatchMs + (elapsed - stopwatchSyncedMs)) },
    })

  stopwatchSyncedMs = elapsed
}, 5_000)

// Sync every 5 minutes if stopwatch is running
const stopwatchSyncInterval = useIntervalFn(syncStopwatch, 300_000, { immediate: false })

// ─── Pomo ───────────────────────────────────────────────────────────────────

const pomoStates = ['work', 'break', 'long-break'] as const
const pomoState = ref<(typeof pomoStates)[number]>('work')
const pomoStateDuration = computed(() =>
  pomoState.value === 'work' ? POMO_TIME : pomoState.value === 'break' ? SHORT_BREAK : LONG_BREAK
)
const pomoCount = ref(0)

const POMO_TIME = 25 * 60 * 1000
const SHORT_BREAK = 5 * 60 * 1000
const LONG_BREAK = 15 * 60 * 1000

function skipPomo() {
  if (pomoState.value === 'work') {
    pomoCount.value++
    pomoState.value = pomoCount.value % 4 === 0 ? 'long-break' : 'break'

    // Increment focus session's pomoCount
    updateFocusSessionMutation.mutate({
      params: { date },
      body: { pomoCount: (focusSession.value?.pomoCount ?? 0) + 1 },
    })
    // Update selected task
    if (task.value)
      updateTaskMutation.mutate({
        params: { id: task.value.id },
        body: { pomoCount: task.value.pomoCount + 1 },
      })
    send({
      title: 'Work session over!',
      body:
        pomoState.value === 'break' ? pickRandom(toBreakMessages) : pickRandom(toLongBreakMessages),
    })
  } else {
    pomoState.value = 'work'
    send({ title: 'Break time over!', body: pickRandom(toWorkMessages) })
  }
  stopwatch.reset()
}
// Skip pomo when stopwatch reaches duration
watch(stopwatch.elapsed, () => {
  if (focusMethod.value === 'pomodoro' && stopwatch.elapsed.value >= pomoStateDuration.value)
    skipPomo()
})

// EXPOSE
defineExpose({ focusMethod, toggleFocusMethod, focusDirty, pomoState })
</script>

<template>
  <ClockWrapper :popout>
    <!-- Div wrapper to hold children together as one row -->
    <div class="flex flex-col items-center">
      <!-- task selector -->
      <div
        v-if="user?.emailVerified && !popout"
        class="from-background/40 to-background/20 absolute flex flex-col items-center gap-1 overflow-hidden rounded-md bg-linear-to-t py-2 backdrop-blur-sm"
        :class="popout ? 'top-0 rounded-t-none' : 'top-1/6 -translate-y-1/2'"
      >
        <Button
          v-if="task"
          variant="ghost-destructive"
          size="icon-sm"
          class="absolute top-0 right-0 rounded-tl-none rounded-tr-none rounded-br-none border-0 not-hover:opacity-60"
          @click.stop="() => selectTask(-1)"
        >
          <X class="translate-x-1/5 -translate-y-1/5" />
        </Button>
        <p class="font-mono text-[10px] tracking-widest uppercase opacity-60">working on</p>
        <ComboboxCreate
          :items="tasks"
          @select="(i) => selectTask(i.id)"
          :create="createNewTask"
          :checked-item-id="task?.id"
          empty="No tasks found."
          placeholder="Search a task"
          align="center"
          class="max-w-64 sm:max-w-80"
          :side-offset="12"
        >
          <div
            class="flex max-w-sm min-w-48 cursor-pointer items-center justify-center sm:min-w-64 md:max-w-md"
          >
            <p
              class="flex items-center gap-3 truncate px-6 text-center text-2xl transition-opacity hover:opacity-80"
              :class="[task ? 'font-light' : 'font-extralight italic opacity-60']"
            >
              {{ task?.name ?? 'No task selected' }}
              <ChevronsUpDown v-if="!task" class="size-4 opacity-60" />
            </p>
          </div>
        </ComboboxCreate>
      </div>

      <!-- Pomo-specific state tabs -->
      <div
        v-if="focusMethod === 'pomodoro' && !popout"
        class="bg-background/40 mb-2 flex gap-1 rounded-full p-1 backdrop-blur-sm [&>button]:backdrop-blur-none"
      >
        <Button
          v-for="state in pomoStates"
          :key="state"
          :variant="state === pomoState ? 'default' : 'ghost'"
          size="sm"
          class="px-3 font-mono text-[10px] font-light tracking-widest uppercase"
          :class="[pomoState === state ? 'font-medium opacity-100!' : 'opacity-60']"
          :disabled="stopwatch.running.value"
          @click="(stopwatch.reset(), (pomoState = state))"
        >
          {{ state }}
        </Button>
      </div>
    </div>

    <!-- Clock -->
    <ClockTime
      :value="
        focusMethod === 'stopwatch'
          ? formatted.slice(stopwatch.elapsed.value > 3600000 ? 0 : 3, -4)
          : formatted
      "
      :sub="focusMethod !== 'pomodoro' && !popout ? formatted.slice(-3, -1) : undefined"
      :popout
    />

    <!-- Actions -->
    <div class="mt-2 grid w-fit grid-cols-3 place-items-center gap-2 justify-self-center">
      <Button
        variant="ghost"
        :size="popout ? 'icon-sm' : 'icon'"
        :disabled="stopwatch.elapsed.value === 0"
        @click="stopwatch.reset()"
      >
        <RefreshCw />
      </Button>
      <Button
        :size="popout ? 'icon-xl' : 'icon-2xl'"
        class="rounded-full *:fill-current"
        @click="stopwatch.toggle()"
      >
        <Pause v-if="stopwatch.running.value" />
        <Play v-else />
      </Button>
      <Button
        v-if="focusMethod === 'pomodoro'"
        variant="ghost"
        :size="popout ? 'icon-sm' : 'icon'"
        :disabled="!stopwatch.running.value"
        @click="skipPomo"
      >
        <FastForward />
      </Button>
    </div>
  </ClockWrapper>
</template>
