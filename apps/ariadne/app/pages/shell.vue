<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { Lightbulb, LightbulbOff } from 'lucide-vue-next'
import { getDailyQuote } from '~/lib/quotes'

definePageMeta({
  layout: 'shell',
})

const inFocus = ref(false)
const focusMethod = useLocalStorage<'stopwatch' | 'pomodoro'>('focus_method', 'stopwatch')
const focusMethodToggleable = ref(true)
provide(focusMethodToggleableKey, focusMethodToggleable)
</script>

<template>
  <!-- TODO: Focus should be here    -->
  <!-- Header | logo -->
  <div class="flex items-start justify-between gap-8">
    <Logo class="h-10 sm:h-12" />
    <div class="flex items-start gap-4">
      <FocusSessions />
      <Profile />
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
            'peer-data-[float=true]:opacity-80 peer-data-[float=true]:md:text-xl peer-data-[float=true]:md:font-medium',
            'peer-data-[float=false]:absolute peer-data-[float=false]:bottom-[20vh] peer-data-[float=false]:left-1/2 peer-data-[float=false]:-translate-x-1/2 peer-data-[float=false]:text-center peer-data-[float=false]:font-light peer-data-[float=false]:italic peer-data-[float=false]:opacity-60'
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
    </div>
  </div>
</template>
