<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'

defineProps<{ value: string; sub?: string }>()

const hasCustomizedAccent = useLocalStorage('hasCustomizedAccent', false)
</script>

<template>
  <!-- Clock -->
  <ThemePicker @update:open="hasCustomizedAccent = true">
    <p
      class="text-foreground-fixed relative w-fit place-self-center text-center font-semibold tabular-nums"
    >
      <span
        class="2xl:text-10xl text-shadow-foreground-fixed/40 -mt-3 h-min text-8xl leading-none text-shadow-lg sm:text-9xl"
      >
        {{ value.replace(':', '꞉' /* modifier colon is more centered */) }}
      </span>
      <span
        v-if="sub"
        class="max-2xs:hidden absolute bottom-1.25 left-full translate-x-4 text-lg tracking-wider brightness-90 sm:bottom-2.25 sm:translate-x-6 sm:text-xl 2xl:bottom-3.25 2xl:text-2xl"
      >
        {{ sub }}
      </span>
    </p>
    <p
      v-if="!hasCustomizedAccent"
      class="font-xs text-muted-foreground absolute top-[calc(100%+var(--spacing)*6)] left-1/2 w-max -translate-x-1/2 rounded-sm px-2 text-center font-light tracking-wide backdrop-blur-sm backdrop-brightness-75"
    >
      Right click to change accent
    </p>
  </ThemePicker>
</template>
