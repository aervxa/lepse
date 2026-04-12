<script setup lang="ts">
import type { Data } from '@lepse/minos/data'
import { useNow } from '@vueuse/core'
import {
  Clock,
  ClockFading,
  FastForward,
  Lightbulb,
  LightbulbOff,
  Link,
  Pause,
  Play,
  RefreshCw,
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { getDailyQuote } from '~/lib/quotes'
import { formatDuration, Stopwatch } from '~/lib/time'
import logoSrc from '~/assets/images/logo.png'

const { $minos } = useNuxtApp()
const { user } = useAuth()

// ─── Session Totals ──────────────────────────────────────────────────────────

const sessionTotals = ref<Data.FocusSession | null>(null)
const loading = ref(true)

const { refresh: reloadTotals } = await useAsyncData(
  'focus-session',
  async () => {
    const [payload] = await $minos.api.focusSessions.show({}).safe()
    if (payload) {
      sessionTotals.value = payload.data
    }
    loading.value = false
    return payload?.data ?? null
  },
  { server: false }
)

// ─── Clock ────────────────────────────────────────────────────────────────────

const now = useNow()
const nowStr = computed(() => now.value.toLocaleTimeString([], { timeStyle: 'short' }))

// ─── Focus State ──────────────────────────────────────────────────────────────

const inFocus = ref(false)
type FocusMethod = 'stopwatch' | 'pomodoro'
const focusMethod = ref<FocusMethod>('stopwatch')

// localStorage only available client-side
onMounted(() => {
  focusMethod.value = (localStorage.getItem('focus_method') as FocusMethod) || 'stopwatch'
})

const toggleFocusMethod = () => {
  focusMethod.value = focusMethod.value === 'stopwatch' ? 'pomodoro' : 'stopwatch'
  localStorage.setItem('focus_method', focusMethod.value)
}

// ─── Stopwatch ────────────────────────────────────────────────────────────────

const stopwatch = new Stopwatch({
  onStop: () => {
    if (!sessionTotals.value) return
    $minos.api.focusSessions.update({
      body: { stopwatchMs: sessionTotals.value.stopwatchMs + stopwatch.elapsed.value },
    })
  },
})

const formattedElapsed = computed(() => formatDuration(stopwatch.elapsed.value))
const totalStopwatchMs = computed(() =>
  formatDuration(stopwatch.elapsed.value + (sessionTotals.value?.stopwatchMs ?? 0), {
    format: 'hhh mmm',
    pad: false,
  })
)

// ─── Pomodoro ─────────────────────────────────────────────────────────────────

const POMO_TIME = 25 * 60 * 1000
const SHORT_BREAK = 5 * 60 * 1000
const LONG_BREAK = 15 * 60 * 1000

const pomoStopwatch = new Stopwatch()
const pomoState = ref<'work' | 'break' | 'long-break'>('work')
const pomoCount = ref(0)

const totalPomoCount = computed(() => pomoCount.value + (sessionTotals.value?.pomoCount ?? 0))

const currentTargetTime = computed(() => {
  if (pomoState.value === 'work') return POMO_TIME
  if (pomoState.value === 'break') return SHORT_BREAK
  return LONG_BREAK
})

const formattedPomoTime = computed(() => {
  const remaining = currentTargetTime.value - pomoStopwatch.elapsed.value
  return formatDuration(remaining, { format: 'mm:ss' })
})

function skipPomo() {
  if (pomoState.value === 'work') {
    pomoCount.value++
    $minos.api.focusSessions.update({ body: { pomoCount: totalPomoCount.value } })
    pomoState.value = pomoCount.value % 4 === 0 ? 'long-break' : 'break'
  } else {
    pomoState.value = 'work'
  }
  pomoStopwatch.reset()
}

// ─── Stop timers on method/focus switch ───────────────────────────────────────

watch([focusMethod, inFocus], () => {
  if (stopwatch.running.value) stopwatch.stop()
  if (pomoStopwatch.running.value) pomoStopwatch.stop()
})

// ─── Reset ────────────────────────────────────────────────────────────────────

const resetting = ref(false)

const resetSessions = async () => {
  resetting.value = true
  stopwatch.reset()
  pomoStopwatch.reset()
  pomoState.value = 'work'
  pomoCount.value = 0

  const [, err] = await $minos.api.focusSessions.destroy({}).safe()
  if (!err) await reloadTotals()
  resetting.value = false
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

const hasActivity = computed(() => totalPomoCount.value > 0 || stopwatch.elapsed.value > 0)
</script>

<template>
  <div class="flex flex-1 flex-col p-8">
    <!-- Header -->
    <div class="flex h-16 items-start justify-between">
      <img :src="logoSrc" class="h-12 not-dark:invert" />

      <!-- Session Totals -->
      <div class="flex flex-col items-end gap-2">
        <p class="font-mono text-xs font-bold tracking-widest uppercase opacity-80">
          Session totals
        </p>

        <template v-if="loading">
          <div class="flex items-center gap-3">
            <Skeleton class="h-4 w-20 rounded" />
            <Skeleton class="h-4 w-20 rounded" />
          </div>
        </template>

        <template v-else>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <ClockFading class="size-4 opacity-80" />
              <p class="text-sm leading-none font-medium opacity-60">{{ totalPomoCount }} pomos</p>
            </div>
            <div class="flex items-center gap-1.5">
              <Clock class="size-4 opacity-80" />
              <p class="text-sm leading-none font-medium opacity-60">{{ totalStopwatchMs }}</p>
            </div>
          </div>

          <AlertDialog v-if="inFocus && hasActivity">
            <AlertDialogTrigger as-child>
              <Button variant="secondary" size="sm" class="mt-3" :disabled="resetting">
                Reset session
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will reset your session totals for today.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" @click="resetSessions">
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </template>
      </div>
    </div>

    <!-- Center -->
    <div class="mx-auto my-auto flex flex-col items-center">
      <template v-if="inFocus">
        <!-- Stopwatch UI -->
        <template v-if="focusMethod === 'stopwatch'">
          <div
            class="bg-muted/40 outline-ring/20 grid place-content-center rounded-xl border-2 px-12 py-8 outline-2 outline-offset-8"
          >
            <p class="text-6xl font-semibold tabular-nums">
              <span>{{ formattedElapsed.slice(0, -4) }}</span>
              <span class="text-3xl font-medium opacity-40">{{ formattedElapsed.slice(-4) }}</span>
            </p>
          </div>
          <div class="mt-12 grid grid-cols-3 place-items-center">
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
          </div>
        </template>

        <!-- Pomodoro UI -->
        <template v-else-if="focusMethod === 'pomodoro'">
          <div class="flex gap-2">
            <Button
              v-for="state in ['work', 'break', 'long-break'] as const"
              :key="state"
              :variant="state === pomoState ? 'default' : 'ghost'"
              size="sm"
              class="mb-6 font-mono text-xs tracking-widest uppercase transition-opacity duration-300"
              :class="pomoState === state ? 'font-bold opacity-100!' : 'opacity-60'"
              :disabled="pomoStopwatch.running.value"
              @click="(pomoStopwatch.reset(), (pomoState = state))"
            >
              {{ state }}
            </Button>
          </div>

          <div
            class="bg-muted/40 outline-ring/20 grid place-content-center rounded-xl border-2 px-12 py-8 outline-2 outline-offset-8"
            :class="{
              'border-destructive/40 outline-destructive/20':
                currentTargetTime - pomoStopwatch.elapsed.value < 0,
            }"
          >
            <p class="text-7xl font-semibold tabular-nums">
              {{ formattedPomoTime }}
            </p>
          </div>

          <div class="mt-12 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              :disabled="pomoStopwatch.elapsed.value === 0"
              @click="pomoStopwatch.reset()"
            >
              <RefreshCw />
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              class="size-14 rounded-full"
              @click="pomoStopwatch.toggle()"
            >
              <Pause v-if="pomoStopwatch.running.value" />
              <Play v-else />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              :disabled="!pomoStopwatch.running.value"
              @click="skipPomo"
            >
              <FastForward />
            </Button>
          </div>
        </template>
      </template>

      <!-- Clock UI -->
      <template v-else>
        <div class="flex flex-col items-center gap-4 pb-12">
          <p class="max-w-sm text-center text-xl font-medium tracking-wide">
            Hey Hey Hey Hey Hey Hey,
            {{ user?.fullName?.replace(' ', '&nbsp;') }}
          </p>
          <p class="relative flex gap-6 font-semibold tabular-nums">
            <span class="text-shadow-ring h-min text-9xl leading-none text-shadow-lg">
              {{ nowStr.slice(0, -3) }}
            </span>
            <span
              class="absolute bottom-2.25 left-full translate-x-6 text-xl tracking-wider opacity-60"
            >
              {{ nowStr.slice(-2) }}
            </span>
          </p>
        </div>
      </template>
    </div>

    <!-- Footer -->
    <div class="flex h-32 items-end justify-between">
      <template v-if="inFocus">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-2">
            <p class="font-mono text-xs tracking-widest uppercase opacity-60">working on</p>
            <p class="line-clamp-1 text-2xl font-extralight italic">Building AFK screen</p>
          </div>
          <span class="bg-muted h-px w-16" />
          <div class="flex items-center gap-2">
            <Link class="size-3 opacity-60" />
            <p class="truncate font-mono text-xs tracking-wider uppercase opacity-60">
              Build Lepse
            </p>
          </div>
        </div>
      </template>

      <template v-else>
        <p class="max-w-[24ch] text-xl font-medium opacity-80">"{{ getDailyQuote() }}"</p>
      </template>

      <!-- Quick Settings -->
      <div class="flex flex-row-reverse gap-3">
        <ThemeToggle class="ms-2" />

        <Button
          variant="outline"
          class="rounded-full font-mono text-[10px] tracking-widest uppercase"
          @click="inFocus = !inFocus"
        >
          <LightbulbOff v-if="inFocus" />
          <Lightbulb v-else />
          {{ inFocus ? 'Exit' : 'Enter' }} Focus
        </Button>

        <Button
          v-if="inFocus"
          variant="outline"
          class="rounded-full font-mono text-[10px] tracking-widest uppercase"
          @click="toggleFocusMethod"
        >
          {{ focusMethod === 'stopwatch' ? 'Pomodoro' : 'Stopwatch' }}
        </Button>
      </div>
    </div>
  </div>
</template>
