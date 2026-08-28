<script setup lang="ts">
withDefaults(
  defineProps<{
    check?: boolean | number
    title?: string
    actionLabel?: string
    action?: () => void
  }>(),
  {
    title: 'Access denied.',
    actionLabel: 'Go back',
  }
)
</script>

<template>
  <div
    v-if="!check"
    class="absolute inset-0 z-50 grid place-content-center bg-black/80 backdrop-blur-xs"
  >
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{{ title }}</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <Button @click="action ? action() : navigateBack()">{{ actionLabel }}</Button>
      </EmptyContent>
    </Empty>
  </div>
</template>
