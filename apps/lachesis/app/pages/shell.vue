<script setup lang="ts">
import { useFullscreen, useLocalStorage } from '@vueuse/core'
import { Copy, Expand, Lightbulb, LightbulbOff, Shrink } from 'lucide-vue-next'
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
    <div
      class="from-background/40 via-background/20 -m-2 flex items-start gap-4 rounded-xs rounded-tr-2xl bg-linear-to-l to-transparent p-2 backdrop-blur-sm rtl:bg-linear-to-r"
    >
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
      <div
        :class="
          cn(
            'from-background/40 via-background/20 peer-data-[float=false]:via-background/40 -m-2 rounded-xs bg-linear-to-r to-transparent px-3 py-2 text-lg opacity-80 backdrop-blur-sm peer-data-[float=false]:from-transparent peer-data-[float=true]:rounded-bl-2xl peer-data-[float=true]:md:text-xl rtl:bg-linear-to-l',
            'peer-data-[float=false]:absolute peer-data-[float=false]:bottom-[20vh] peer-data-[float=false]:left-1/2 peer-data-[float=false]:-translate-x-1/2 peer-data-[float=false]:text-center peer-data-[float=false]:italic'
          )
        "
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <p class="w-full max-w-[28ch] font-medium text-pretty">"{{ getDailyQuote() }}"</p>
          </ContextMenuTrigger>

          <ContextMenuContent>
            <ContextMenuItem>
              <Copy />
              Copy
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
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
