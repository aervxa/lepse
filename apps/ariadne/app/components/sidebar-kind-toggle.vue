<script setup lang="ts">
import { Rotate3D } from 'lucide-vue-next'
import { useSidebar } from './ui/sidebar'

const props = withDefaults(
  defineProps<{
    expandSidebar: boolean
  }>(),
  { expandSidebar: true }
)

const { state, toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    variant="secondary"
    size="icon-sm"
    @click="
      expandSidebar
        ? state === 'collapsed' && toggleSidebar()
        : state === 'expanded' && toggleSidebar()
    "
  >
    <Rotate3D />
  </Button>
</template>
