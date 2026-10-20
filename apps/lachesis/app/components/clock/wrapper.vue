<script setup lang="ts">
defineProps<{ popout?: boolean }>()
</script>

<template>
  <div
    class="mx-auto flex-1"
    :class="
      popout
        ? 'flex size-full flex-col items-center-safe justify-center-safe gap-6'
        : 'grid grid-rows-[minmax(128px,1fr)_auto_minmax(128px,1fr)] place-items-center gap-8 *:first:self-end *:last:self-start'
    "
  >
    <slot />
  </div>
</template>
