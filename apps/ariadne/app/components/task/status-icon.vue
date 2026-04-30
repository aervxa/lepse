<script setup lang="ts">
import { CircleCheck, CircleDashed, CircleX, Loader } from 'lucide-vue-next'

defineProps<{
  status: string
}>()
</script>

<template>
  <CircleCheck v-if="status === 'done'" />
  <Loader v-else-if="status === 'in_progress'" />
  <CircleX v-else-if="status === 'canceled'" />
  <CircleDashed v-else />
</template>
