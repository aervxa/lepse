<script setup lang="ts">
import { useDebounceFn, useIntervalFn, useNow } from '@vueuse/core'
import { ChevronsUpDown, FastForward, Pause, Play, RefreshCw } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { getGreeting } from '~/lib/greetings'
import { formatDuration, Stopwatch } from '~/lib/time'

const { inFocus, focusMethod } = defineProps<{
  inFocus: boolean
  focusMethod: 'stopwatch' | 'pomodoro'
}>()

watch(
  () => inFocus,
  () => {
    stopwatch.reset()
  }
)

const { user } = useAuth()
const now = useNow()
const nowStr = computed(() => now.value.toLocaleTimeString([], { timeStyle: 'short' }))

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
    if (focusMethod === 'stopwatch') stopwatchSyncInterval.resume()
  },
  onStop: () => {
    if (focusMethod === 'stopwatch') {
      syncStopwatch()
      stopwatchSyncInterval.pause()
    }
  },
})

const formatted = computed(() => {
  if (focusMethod === 'stopwatch') {
    return formatDuration(stopwatch.elapsed.value)
  } else if (focusMethod === 'pomodoro') {
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
// Reset stopwatch when focusMethod changes
watch(
  () => focusMethod,
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
  <div
    class="mx-auto grid flex-1 grid-rows-[minmax(160px,1fr)_auto_minmax(160px,1fr)] gap-8 *:first:self-end *:last:self-start"
  >
    <!-- Div wrapper to hold children together as one row -->
    <div class="flex flex-col items-center">
      <!-- inFocus specific -->
      <template v-if="inFocus">
        <!-- task selector -->
        <div
          class="from-background/40 to-background/20 absolute top-1/6 flex -translate-y-1/2 flex-col items-center gap-1 rounded-md bg-linear-to-t px-3 py-2 backdrop-blur-sm"
        >
          <p class="font-mono text-[10px] tracking-widest uppercase opacity-60">working on</p>
          <Combobox
            :items="tasks"
            @select="(i) => selectTask(i.id)"
            :create="createNewTask"
            :checked-item-id="task?.id"
            empty="No tasks found."
            placeholder="Search a task"
            align="center"
            class="w-xs md:w-sm"
            :side-offset="12"
          >
            <div
              class="group flex w-fit max-w-sm cursor-pointer items-center justify-center gap-2 md:max-w-md"
            >
              <p
                class="truncate pr-[1ch] text-2xl"
                :class="[task ? 'font-light' : 'font-extralight italic']"
              >
                {{ task?.name ?? 'No task selected' }}
              </p>
              <Button
                variant="ghost"
                size="icon-xs"
                :disabled="stopwatch.running.value"
                class="text-muted-foreground group-hover:text-foreground -ml-[1ch]"
              >
                <ChevronsUpDown />
              </Button>
            </div>
          </Combobox>
        </div>

        <!-- Pomo-specific state tabs -->
        <div
          v-if="focusMethod === 'pomodoro'"
          class="bg-background/40 mb-2 flex gap-1 rounded-full p-1 backdrop-blur-sm [&>button]:backdrop-blur-none"
        >
          <Button
            v-for="state in pomoStates"
            :key="state"
            :variant="state === pomoState ? 'default' : 'ghost'"
            size="sm"
            class="px-3 font-mono text-[10px] font-light tracking-widest uppercase"
            :class="pomoState === state ? 'font-medium opacity-100!' : 'opacity-60'"
            :disabled="stopwatch.running.value"
            @click="(stopwatch.reset(), (pomoState = state))"
          >
            {{ state }}
          </Button>
        </div>
      </template>

      <!-- Out of focus greeting title -->
      <p
        v-if="!inFocus"
        class="fixed-color-clock:text-foreground text-foreground-fixed max-w-xs text-center text-base leading-relaxed font-semibold tracking-wide text-pretty sm:max-w-sm sm:text-xl 2xl:text-2xl"
      >
        {{ getGreeting(now).replace('{name}', user?.fullName ?? 'User') }}
      </p>
    </div>

    <!-- Clock -->
    <ThemePicker>
      <p class="text-foreground-fixed relative flex font-semibold tabular-nums">
        <span
          class="2xl:text-10xl text-shadow-foreground-fixed/40 -mt-3 h-min text-8xl leading-none text-shadow-lg sm:text-9xl"
        >
          {{
            (!inFocus
              ? nowStr.slice(0, -3)
              : focusMethod === 'stopwatch'
                ? formatted.slice(stopwatch.elapsed.value > 3600000 ? 0 : 3, -4)
                : formatted
            ).replace(':', '꞉' /* modifier colon is more centered */)
          }}
        </span>
        <span
          v-if="focusMethod !== 'pomodoro'"
          class="absolute bottom-1.25 left-full translate-x-4 text-lg tracking-wider brightness-90 sm:bottom-2.25 sm:translate-x-6 sm:text-xl 2xl:bottom-3.25 2xl:text-2xl"
        >
          {{ !inFocus ? nowStr.slice(-2) : formatted.slice(-3, -1) }}
        </span>
      </p>
    </ThemePicker>

    <!-- inFocus actions -->
    <div
      v-if="inFocus"
      class="mt-2 grid w-fit grid-cols-3 place-items-center gap-2 justify-self-center"
    >
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
        v-if="focusMethod === 'pomodoro'"
        variant="ghost"
        size="icon"
        :disabled="!stopwatch.running.value"
        @click="skipPomo"
      >
        <FastForward />
      </Button>
    </div>
  </div>
</template>
