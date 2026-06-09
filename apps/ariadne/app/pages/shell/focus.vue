<script setup lang="ts">
import { FastForward, Pause, Play, RefreshCw } from 'lucide-vue-next'
import { formatDuration, Stopwatch } from '~/lib/time'

const { method } = defineProps<{ method: 'stopwatch' | 'pomodoro' }>()

// ─── Shared stopwatch ───────────────────────────────────────────────────────

const stopwatch = new Stopwatch()

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
watch([stopwatch.running], () => {
  if (focusMethodToggleable) focusMethodToggleable.value = !stopwatch.running.value
})
// Reset stopwatch when method changes
watch(
  () => method,
  () => {
    stopwatch.reset()
  }
)

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
  } else {
    pomoState.value = 'work'
  }
  stopwatch.reset()
}
</script>

<template>
  <!-- Stopwatch -->
  <p v-if="method === 'stopwatch'" class="text-6xl font-semibold tabular-nums">
    <span>{{ formatted.slice(stopwatch.elapsed.value > 3600000 ? 0 : 3, -4) }}</span>
    <span class="text-3xl font-medium opacity-40">{{ formatted.slice(-4) }}</span>
  </p>
  <!-- Pomo -->
  <template v-else-if="method === 'pomodoro'">
    <div class="flex gap-2">
      <Button
        v-for="state in pomoStates"
        :key="state"
        :variant="state === pomoState ? 'default' : 'ghost'"
        size="sm"
        class="mb-6 font-mono text-xs tracking-widest uppercase transition-opacity duration-300"
        :class="pomoState === state ? 'font-bold opacity-100!' : 'opacity-60'"
        :disabled="stopwatch.running.value"
        @click="(stopwatch.reset(), (pomoState = state))"
      >
        {{ state }}
      </Button>
    </div>
    <p class="text-center text-7xl font-semibold tabular-nums">
      {{ formatted }}
    </p>
  </template>

  <!-- Actions -->
  <div class="mt-8 grid grid-cols-3 place-items-center gap-4">
    <Button
      variant="ghost"
      size="icon"
      :disabled="stopwatch.elapsed.value === 0"
      @click="stopwatch.reset()"
    >
      <RefreshCw />
    </Button>
    <Button
      variant="outline"
      size="icon-lg"
      class="size-14 rounded-full"
      @click="stopwatch.toggle()"
    >
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
