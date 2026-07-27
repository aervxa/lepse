<script setup lang="ts">
import { useFullscreen, useLocalStorage } from '@vueuse/core'
import { Expand, Lightbulb, LightbulbOff, Shrink } from 'lucide-vue-next'
import { getDailyQuote } from '~/lib/quotes'

definePageMeta({
  layout: 'shell',
})

const inFocus = ref(false)
const focusMethod = useLocalStorage<'stopwatch' | 'pomodoro'>('focus_method', 'stopwatch')
const focusMethodToggleable = ref(true)
provide(focusMethodToggleableKey, focusMethodToggleable)

const {
  isFullscreen,
  isSupported: isFullscreenSupported,
  toggle: toggleFullscreen,
} = useFullscreen()
</script>

<template>
  <!-- Header | logo -->
  <div class="flex items-start justify-between gap-8">
    <img src="/logo.png" class="pointer-events-none h-10 not-dark:invert sm:h-12" />
    <div class="flex items-start gap-4">
      <FocusSessions />
      <Profile />
      <SettingsDialog />
    </div>
  </div>

  <!-- Center | clock -->
  <div
    class="relative mx-auto my-auto flex flex-col items-center gap-4 pt-[8vh] pb-[16vh] max-sm:pb-[20vh]"
  >
    <Focus v-if="inFocus" :method="focusMethod" />
    <Clock v-else />
  </div>

  <!-- Footer | actions -->
  <div class="flex items-end justify-between gap-8">
    <div>
      <BubbleNav />
      <p
        class="w-full max-w-[28ch] text-lg text-pretty"
        :class="
          cn(
            'opacity-80 peer-data-[float=true]:md:text-xl peer-data-[float=true]:md:font-medium',
            'peer-data-[float=false]:absolute peer-data-[float=false]:bottom-[20vh] peer-data-[float=false]:left-1/2 peer-data-[float=false]:-translate-x-1/2 peer-data-[float=false]:text-center peer-data-[float=false]:font-normal peer-data-[float=false]:italic'
          )
        "
      >
        "{{ getDailyQuote() }}"
      </p>
    </div>

    <div class="flex gap-2">
      <Button
        v-if="inFocus"
        variant="outline"
        class="font-mono text-[10px] tracking-widest uppercase"
        @click="focusMethod = focusMethod === 'stopwatch' ? 'pomodoro' : 'stopwatch'"
        :disabled="!focusMethodToggleable"
      >
        {{ focusMethod === 'stopwatch' ? 'Pomodoro' : 'Stopwatch' }}
      </Button>
      <Button
        :variant="inFocus ? 'secondary' : 'default'"
        class="font-mono text-[11px] tracking-widest uppercase"
        @click="inFocus = !inFocus"
      >
        <LightbulbOff v-if="inFocus" />
        <Lightbulb v-else />
        {{ inFocus ? 'Exit' : 'Focus' }}
      </Button>
      <Button v-if="isFullscreenSupported" variant="ghost" size="icon" @click="toggleFullscreen">
        <Shrink v-if="isFullscreen" />
        <Expand v-else />
      </Button>
    </div>
  </div>
</template>
