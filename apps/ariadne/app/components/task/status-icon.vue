<script setup lang="ts">
import { Circle, CircleCheck, CircleX, Loader } from 'lucide-vue-next'

defineProps<{
  status: string
}>()
</script>

<template>
  <CircleCheck v-if="status === 'done'" />
  <Loader v-else-if="status === 'in_progress'" />
  <CircleX v-else-if="status === 'canceled'" />
  <Circle v-else />
</template>
