<script setup lang="ts">
import { useFullscreen, useLocalStorage } from '@vueuse/core'
import { Copy, Expand, Lightbulb, LightbulbOff, Shrink } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
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

const quote = useTemplateRef('quote')
const copyQuote = async () => {
  try {
    if (!quote.value?.innerText) throw new Error('no quote elm')
    await navigator.clipboard.writeText(quote.value.innerText)
    toast.success('Quote copied!')
  } catch {
    toast.error("Couldn't copy quote :(")
  }
}
</script>

<template>
  <!-- Header | logo -->
  <div class="flex items-start justify-between gap-8">
    <Logo />
    <div
      class="from-background/40 via-background/20 -m-2 flex items-start gap-4 rounded-xs rounded-tr-2xl bg-linear-to-l to-transparent p-2 ps-3 backdrop-blur-sm rtl:rounded-tl-2xl rtl:bg-linear-to-r"
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
      <ContextMenu>
        <ContextMenuTrigger>
          <p
            ref="quote"
            class="sm:from-background/40 sm:via-background/20 via-background/40 -m-2 w-full max-w-[28ch] rounded-xs bg-linear-to-r from-transparent to-transparent px-3 py-2 text-lg font-medium text-pretty opacity-80 backdrop-blur-sm max-sm:absolute max-sm:bottom-[20vh] max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:text-center max-sm:italic sm:rounded-bl-2xl md:text-xl rtl:bg-linear-to-l sm:rtl:rounded-br-2xl"
          >
            "{{ getDailyQuote() }}"
          </p>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem @select="copyQuote">
            <Copy />
            Copy
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
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
