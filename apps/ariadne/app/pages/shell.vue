<script setup lang="ts">
import { useLocalStorage, useWindowSize } from '@vueuse/core'
import { Lightbulb, LightbulbOff } from 'lucide-vue-next'
import { getDailyQuote } from '~/lib/quotes'

definePageMeta({
  layout: 'shell',
})

const route = useRoute()

const { width } = useWindowSize()
const floatNav = computed(() => width.value >= 768)

const inFocus = computed(() => route.path.startsWith('/shell/focus'))
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
  <div class="relative mx-auto my-auto flex flex-col items-center gap-4 pb-[16vh] sm:pb-[10vh]">
    <NuxtPage v-if="inFocus" :method="focusMethod" />
    <Clock v-else />
  </div>

  <!-- Footer | actions -->
  <div class="flex items-end justify-between gap-8">
    <div>
      <BubbleNav :float="floatNav" />
      <p
        v-if="!inFocus || floatNav"
        class="max-w-[28ch] text-lg text-pretty"
        :class="[
          floatNav
            ? 'opacity-80 md:text-xl md:font-medium'
            : 'absolute bottom-[20vh] left-1/2 -translate-x-1/2 text-center font-light italic opacity-60',
        ]"
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
        as-child
      >
        <NuxtLink :to="inFocus ? '/shell' : '/shell/focus'">
          <LightbulbOff v-if="inFocus" />
          <Lightbulb v-else />
          {{ inFocus ? 'Exit' : 'Focus' }}
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>
