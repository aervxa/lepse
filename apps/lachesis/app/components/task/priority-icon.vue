<script setup lang="ts">
import { CircleAlert, CircleSlash, SignalHigh, SignalLow, SignalMedium } from 'lucide-vue-next'

defineProps<{
  priority: string
}>()
</script>

<template>
  <SignalLow v-if="priority === 'low'" />
  <SignalMedium v-else-if="priority === 'medium'" />
  <SignalHigh v-else-if="priority === 'high'" />
  <CircleAlert v-else-if="priority === 'urgent'" />
  <CircleSlash v-else />
</template>
