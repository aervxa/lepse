<script setup lang="ts">
import { useDebounceFn, useIntervalFn, useLocalStorage, useNow } from '@vueuse/core'
import { ChevronsUpDown, FastForward, Pause, Play, RefreshCw, X } from '@lucide/vue'
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

const date = getClientDate()
const { focusSession, updateFocusSessionMutation } = useDay(date)

// ─── Task ───────────────────────────────────────────────────────────────────

const { tasks, focusedTaskId, updateTaskMutation, createTaskMutation } = useTasks()
const task = computed(() => tasks.value?.find((t) => t.id === focusedTaskId.value))

const selectTask = (id: number) => {
  // fn SHOULD change focusedTaskId
  const r = () => {
    focusedTaskId.value = id
  }
  if (focusDirty?.value && focusedTaskId.value !== -1) {
    dialog({
      title: 'Are you sure?',
      description:
        id > -1
          ? 'Switching will carry over your progress to the new task.'
          : 'Cancelling will result in your progress being lost.',
    }).then((v) => {
      if (v) {
        if (focusMethod === 'stopwatch' && task.value) {
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

const createNewTask = async (search: string) => {
  createTaskMutation.mutate(
    { body: { name: search } },
    {
      onError: (err) => toast.error('Failed to create task!', { description: err.message }),
    }
  )
}

// ─── Shared stopwatch class ─────────────────────────────────────────────────

const focusDirty = inject(focusDirtyKey)
const stopwatch = new Stopwatch({
  onStart: () => {
    if (focusMethod === 'stopwatch') stopwatchSyncInterval.resume()
    focusDirty && (focusDirty.value = true)
  },
  onStop: () => {
    if (focusMethod === 'stopwatch') {
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
  stopwatch.running,
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
  updateFocusSessionMutation.mutate({
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

// Sync every 10 seconds if stopwatch is running
const stopwatchSyncInterval = useIntervalFn(syncStopwatch, 60_000, { immediate: false })

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
    updateFocusSessionMutation.mutate({
      body: { pomoCount: (focusSession.value?.pomoCount ?? 0) + 1 },
    })
    // Update selected task
    if (task.value)
      updateTaskMutation.mutate({
        params: { id: task.value.id },
        body: { pomoCount: task.value.pomoCount + 1 },
      })
  } else {
    pomoState.value = 'work'
  }
  stopwatch.reset()
}

const hasCustomizedAccent = useLocalStorage('hasCustomizedAccent', false)
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
          v-if="user?.emailVerified"
          class="from-background/40 to-background/20 absolute top-1/6 flex -translate-y-1/2 flex-col items-center gap-1 overflow-hidden rounded-md bg-linear-to-t py-2 backdrop-blur-sm"
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
          <Combobox
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
        class="fixed-color-clock:text-foreground text-foreground-fixed max-w-xs text-center text-lg leading-relaxed font-medium text-pretty sm:max-w-sm sm:text-xl md:text-2xl 2xl:text-3xl"
      >
        {{ getGreeting(now).replace('{name}', user?.name ?? 'wraith') }}
      </p>
    </div>

    <!-- Clock -->
    <ThemePicker @update:open="hasCustomizedAccent = true">
      <p
        class="text-foreground-fixed relative w-fit place-self-center text-center font-semibold tabular-nums"
      >
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
          v-if="!inFocus || focusMethod !== 'pomodoro'"
          class="max-2xs:hidden absolute bottom-1.25 left-full translate-x-4 text-lg tracking-wider brightness-90 sm:bottom-2.25 sm:translate-x-6 sm:text-xl 2xl:bottom-3.25 2xl:text-2xl"
        >
          {{ !inFocus ? nowStr.slice(-2) : formatted.slice(-3, -1) }}
        </span>
      </p>
      <p
        v-if="!inFocus && !hasCustomizedAccent"
        class="font-xs text-muted-foreground absolute top-[calc(100%+var(--spacing)*6)] left-1/2 w-max -translate-x-1/2 rounded-sm px-2 text-center font-light tracking-wide backdrop-blur-sm backdrop-brightness-75"
      >
        Right click to change accent
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
