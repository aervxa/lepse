<script setup lang="ts">
import { Clock, ClockFading } from 'lucide-vue-next'
import { formatDuration } from '~/lib/time'

const { focusSession, fetchFocusSession } = useDay()

onMounted(() => {
  if (!focusSession.value) {
    fetchFocusSession()
  }
})
</script>

<template>
  <div class="flex flex-col items-end gap-2">
    <p class="font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-80">
      Session totals
    </p>

    <div class="flex items-center gap-3">
      <template v-if="focusSession">
        <div
          v-for="item in [
            { icon: ClockFading, label: `${focusSession.pomoCount} pomos` },
            {
              icon: Clock,
              label: `${formatDuration(focusSession.stopwatchMs, {
                format: 'hhh mmm',
                pad: false,
              })}`,
            },
          ]"
          class="flex items-center gap-1 sm:gap-1.5"
        >
          <component :is="item.icon" class="size-3 sm:size-4 opacity-80" />
          <p class="text-xs sm:text-sm leading-none font-medium opacity-60">{{ item.label }}</p>
        </div>
      </template>

      <template v-else>
        <Skeleton class="h-3 sm:h-4 w-16 sm:w-20 rounded" />
        <Skeleton class="h-3 sm:h-4 w-16 sm:w-20 rounded" />
      </template>
    </div>
  </div>
</template>
