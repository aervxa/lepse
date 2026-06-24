<script setup lang="ts">
import type { PopoverContentEmits, PopoverContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { PopoverContent, PopoverPortal, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<PopoverContentProps & { class?: HTMLAttributes['class']; unstyled?: boolean }>(),
  {
    align: 'center',
    sideOffset: 4,
  }
)
const emits = defineEmits<PopoverContentEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'unstyled')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <PopoverPortal>
    <AnimatePresence>
      <PopoverContent
        data-slot="popover-content"
        v-bind="{ ...$attrs, ...forwarded }"
        :class="
          cn(
            unstyled
              ? 'pointer-events-none! *:pointer-events-auto!'
              : 'bg-popover data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/5 flex origin-(--reka-popover-content-transform-origin) flex-col gap-4 rounded-2xl p-4 shadow-2xl ring-1 duration-100',
            'text-popover-foreground z-50 w-72 text-sm outline-hidden',
            props.class
          )
        "
      >
        <slot />
      </PopoverContent>
    </AnimatePresence>
  </PopoverPortal>
</template>

<style>
[data-reka-popper-content-wrapper] {
  pointer-events: none;
}
[data-reka-popper-content-wrapper] > * {
  pointer-events: auto;
}
</style>
