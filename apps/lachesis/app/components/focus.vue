<script setup lang="ts">
import { useDebounceFn, useIntervalFn } from '@vueuse/core'
import { ChevronsUpDown, FastForward, Pause, Play, RefreshCw } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { formatDuration, Stopwatch } from '~/lib/time'

const { method } = defineProps<{ method: 'stopwatch' | 'pomodoro' }>()

const { focusSession, updateFocusSession } = useDay(getClientDate())

// ─── Task ───────────────────────────────────────────────────────────────────

const { tasks, updateTask, createTask } = useTasks()
const taskId = ref<number | null>(null)
const task = computed(() => tasks.value.find((t) => t.id === taskId.value))

const selectTask = (id: number) => {
  stopwatch.reset()
  taskId.value = id
}

const createNewTask = async (search: string) => {
  const error = await createTask({ name: search })
  if (error) toast.error('Failed to create task!', { description: error.message })
}

// ─── Shared stopwatch class ─────────────────────────────────────────────────

const stopwatch = new Stopwatch({
  onStart: () => {
    if (method === 'stopwatch') stopwatchSyncInterval.resume()
  },
  onStop: () => {
    if (method === 'stopwatch') {
      syncStopwatch()
      stopwatchSyncInterval.pause()
    }
  },
})

const formatted = computed(() => {
  if (method === 'stopwatch') {
    return formatDuration(stopwatch.elapsed.value)
  } else if (method === 'pomodoro') {
    const pomoElapsed =
      (pomoState.value === 'work'
        ? POMO_TIME
        : pomoState.value === 'break'
          ? SHORT_BREAK
          : LONG_BREAK) - stopwatch.elapsed.value
    return formatDuration(pomoElapsed, { format: 'mm:ss' })
  } else {
    return ''
  }
})

const focusMethodToggleable = inject(focusMethodToggleableKey)

// Update focusMethodToggleable when stopwatch running state changes
watch(
  [stopwatch.running],
  () => {
    if (focusMethodToggleable) focusMethodToggleable.value = !stopwatch.running.value
  },
  { immediate: true }
)
// Reset stopwatch when method changes
watch(
  () => method,
  () => {
    stopwatch.reset()
  }
)

// ─── Stopwatch ──────────────────────────────────────────────────────────────

let stopwatchSyncedMs = 0
const syncStopwatch = useDebounceFn(() => {
  const elapsed = stopwatch.elapsed.value

  // Update focus session's stopwatchMs
  updateFocusSession({
    stopwatchMs: (focusSession.value?.stopwatchMs ?? 0) + (elapsed - stopwatchSyncedMs),
  })
  // Update selected task
  if (task.value)
    updateTask(task.value.id, {
      stopwatchMs: task.value.stopwatchMs + (elapsed - stopwatchSyncedMs),
    })

  stopwatchSyncedMs = elapsed
}, 1_000)

// Sync every 10 seconds if stopwatch is running
const stopwatchSyncInterval = useIntervalFn(syncStopwatch, 10_000, { immediate: false })

// ─── Pomo ───────────────────────────────────────────────────────────────────

const pomoStates = ['work', 'break', 'long-break'] as const
const pomoState = ref<(typeof pomoStates)[number]>('work')
const pomoCount = ref(0)

const POMO_TIME = 25 * 60 * 1000
const SHORT_BREAK = 5 * 60 * 1000
const LONG_BREAK = 15 * 60 * 1000

function skipPomo() {
  if (pomoState.value === 'work') {
    pomoCount.value++
    pomoState.value = pomoCount.value % 4 === 0 ? 'long-break' : 'break'

    // Increment focus session's pomoCount
    updateFocusSession({ pomoCount: (focusSession.value?.pomoCount ?? 0) + 1 })
    // Update selected task
    if (task.value) updateTask(task.value.id, { pomoCount: task.value.pomoCount + 1 })
  } else {
    pomoState.value = 'work'
  }
  stopwatch.reset()
}
</script>

<template>
  <!-- TODO: Move task selector away to the top part of the page -->
  <div class="w-full" :class="[method === 'stopwatch' ? 'mt-8 mb-6' : 'mb-4']">
    <Combobox
      :items="tasks"
      @select="(i) => selectTask(i.id)"
      :create="createNewTask"
      :checked-item-id="task?.id"
      empty="No tasks found."
      placeholder="Search a task"
      align="center"
    >
      <Button variant="outline" role="combobox" class="w-full justify-between">
        {{ task ? task.name : 'Select task...' }}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-60" />
      </Button>
    </Combobox>
  </div>

  <!-- Pomo-specific state tabs -->
  <template v-if="method === 'pomodoro'">
    <div class="flex gap-2">
      <Button
        v-for="state in pomoStates"
        :key="state"
        :variant="state === pomoState ? 'default' : 'ghost'"
        size="xs"
        class="font-mono text-[10px] font-light tracking-widest uppercase"
        :class="pomoState === state ? 'font-medium opacity-100!' : 'opacity-60'"
        :disabled="stopwatch.running.value"
        @click="(stopwatch.reset(), (pomoState = state))"
      >
        {{ state }}
      </Button>
    </div>
  </template>
  <!-- Stopwatch/Pomo main display -->
  <p class="relative flex font-semibold tabular-nums">
    <span class="2xl:text-10xl h-min text-8xl leading-none sm:text-9xl">
      {{
        method === 'stopwatch'
          ? formatted.slice(stopwatch.elapsed.value > 3600000 ? 0 : 3, -4)
          : formatted
      }}
    </span>
    <span
      v-if="method === 'stopwatch'"
      class="absolute bottom-2.25 left-full translate-x-4 text-xl tracking-wider opacity-60 sm:translate-x-6"
    >
      {{ formatted.slice(-3, -1) }}
    </span>
  </p>

  <!-- Actions -->
  <div class="top-full mt-4 grid grid-cols-3 place-items-center gap-2">
    <Button
      variant="ghost"
      size="icon"
      :disabled="stopwatch.elapsed.value === 0"
      @click="stopwatch.reset()"
    >
      <RefreshCw />
    </Button>
    <Button size="icon-lg" class="size-14 rounded-full" @click="stopwatch.toggle()">
      <Pause v-if="stopwatch.running.value" />
      <Play v-else />
    </Button>
    <Button
      v-if="method === 'pomodoro'"
      variant="ghost"
      size="icon"
      :disabled="!stopwatch.running.value"
      @click="skipPomo"
    >
      <FastForward />
    </Button>
  </div>
</template>
