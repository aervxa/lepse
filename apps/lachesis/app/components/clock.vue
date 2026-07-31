<script setup>
import { RotateCcw, X } from '@lucide/vue'
import { useLocalStorage, useNow } from '@vueuse/core'
import { getGreeting } from '~/lib/greetings'

const { user } = useAuth()
const now = useNow()
const nowStr = computed(() => now.value.toLocaleTimeString([], { timeStyle: 'short' }))

const blurClock = ref(false)
const COLORS = [
  '', // default
  '#EF8B76', // red
  '#EDB35C', // amber
  '#DDCB6B', // yellow
  '#AFCE6B', // lime
  '#71CE8C', // green
  '#6BCEB2', // teal
  '#6BB4CE', // cyan
  '#7591DD', // blue
  '#9284DD', // indigo
  '#B476DD', // violet
  '#CE76BA', // magenta
  '#DD7692', // rose
]
const color = useLocalStorage('clockColor', '')
</script>

<template>
  <p
    class="max-w-xs text-center text-base leading-relaxed font-medium tracking-wide text-pretty sm:max-w-sm sm:text-xl 2xl:text-2xl"
  >
    {{ getGreeting(now).replace('{name}', user?.fullName ?? 'User') }}
  </p>
  <ContextMenu v-model:open="blurClock">
    <ContextMenuTrigger>
      <p
        :style="{
          '--color': `${color || 'var(--foreground)'}`,
        }"
        class="relative flex font-semibold text-(--color) tabular-nums transition-[filter] duration-500 ease-out"
        :class="[blurClock ? 'blur-xs brightness-75 duration-500' : 'duration-300']"
      >
        <span
          class="2xl:text-10xl h-min text-8xl leading-none text-shadow-(color:--color)/60 text-shadow-lg sm:text-9xl"
        >
          {{ nowStr.slice(0, -3) }}
        </span>
        <span
          class="absolute bottom-1.25 left-full translate-x-4 text-lg tracking-wider opacity-80 sm:bottom-2.25 sm:translate-x-6 sm:text-xl 2xl:bottom-3.25 2xl:text-2xl"
        >
          {{ nowStr.slice(-2) }}
        </span>
      </p>
    </ContextMenuTrigger>
    <ContextMenuContent
      style="--radius: calc(var(--spacing) * 14)"
      class="pointer-events-none size-[calc(var(--radius)*2)] min-w-0 -translate-1/2 animate-none! overflow-visible rounded-full bg-transparent shadow-none ring-0 backdrop-blur-none"
    >
      <div
        style="--inner-radius: calc(var(--spacing) * 3.5)"
        class="relative top-1/2 left-1/2 size-[calc(var(--inner-radius)*2)] -translate-1/2 rounded-full [&_button]:transition-transform [&_button]:duration-100 [&_button]:ease-out [&_button]:outline-none [&_button]:hover:scale-140 [&_button]:active:scale-125"
      >
        <ContextMenuItem class="contents" @select.once.prevent>
          <button
            class="text-destructive absolute grid size-full place-content-center rounded-full hover:contrast-200"
            @click="blurClock = false"
          >
            <X class="size-5 stroke-3" />
          </button>
        </ContextMenuItem>
        <div
          v-for="(c, i) in COLORS"
          :style="{
            '--color': c,
            '--angle': `calc(360deg / ${COLORS.length} * ${i} + 90deg)`,
            'transform':
              'rotate(var(--angle)) translateX(calc(var(--radius) - var(--inner-radius))) rotate(calc(-1 * var(--angle)))',
          }"
          class="absolute size-full rounded-full"
          :class="[i === 0 ? 'z-10' : 'z-0']"
        >
          <ContextMenuItem class="contents" @select="color = c">
            <button
              :style="{ backgroundColor: c || 'var(--foreground)' }"
              class="absolute inset-0 rounded-full border border-black/10"
              :class="[i === 0 && 'grid place-content-center']"
            >
              <RotateCcw v-if="i === 0" class="text-muted-foreground size-(--inner-radius)" />
            </button>
          </ContextMenuItem>
        </div>
      </div>
    </ContextMenuContent>
  </ContextMenu>
</template>
