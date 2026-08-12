<script setup lang="ts">
import { CircleStar, CircleX, Crosshair } from '@lucide/vue'

defineProps<{
  status: string
}>()
</script>

<template>
  <CircleStar v-if="status === 'completed'" />
  <CircleX v-else-if="status === 'abandoned'" />
  <Crosshair v-else />
</template>
