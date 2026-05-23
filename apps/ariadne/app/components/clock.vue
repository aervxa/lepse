<script setup>
import { useNow } from '@vueuse/core'
import { getGreeting } from '~/lib/greetings'

const { user } = useAuth()
const now = useNow()
const nowStr = computed(() => now.value.toLocaleTimeString([], { timeStyle: 'short' }))
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <p
      class="max-w-xs text-center text-base font-medium tracking-wide text-pretty sm:max-w-sm sm:text-xl"
    >
      {{ getGreeting(now).replace('{name}', user?.fullName ?? 'User') }}
    </p>
    <p class="relative flex gap-6 font-semibold tabular-nums">
      <span class="text-shadow-ring h-min text-8xl leading-none text-shadow-lg sm:text-9xl">
        {{ nowStr.slice(0, -3) }}
      </span>
      <span
        class="absolute bottom-2.25 left-full translate-x-4 text-xl tracking-wider opacity-60 sm:translate-x-6"
      >
        {{ nowStr.slice(-2) }}
      </span>
    </p>
  </div>
</template>
