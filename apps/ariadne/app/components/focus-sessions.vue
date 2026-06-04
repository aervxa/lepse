<script setup lang="ts">
import { Clock, ClockFading } from 'lucide-vue-next'
import { formatDuration } from '~/lib/time'

const { focusSession, fetchFocusSession } = useDay()

const isLoading = ref(false)

onMounted(() => {
  if (!focusSession.value) {
    skeletonLoad(fetchFocusSession(), isLoading)
  }
})
</script>

<template>
  <div class="flex flex-col items-end gap-2">
    <p class="font-mono text-[10px] font-bold tracking-widest uppercase opacity-80 sm:text-xs">
      Session totals
    </p>

    <div class="flex items-center gap-3">
      <template v-if="isLoading">
        <Skeleton class="h-3 w-16 rounded sm:h-4 sm:w-20" />
        <Skeleton class="h-3 w-16 rounded sm:h-4 sm:w-20" />
      </template>

      <template v-else>
        <div
          v-for="item in [
            { icon: ClockFading, label: `${focusSession?.pomoCount ?? 0} pomos` },
            {
              icon: Clock,
              label: `${formatDuration(focusSession?.stopwatchMs ?? 0, {
                format:
                  focusSession && focusSession.stopwatchMs >= 3_600_000 /* an hour */
                    ? 'hhh mmm'
                    : 'mmm',
                pad: false,
              })}`,
            },
          ]"
          class="flex items-center gap-1 sm:gap-1.5"
        >
          <component :is="item.icon" class="size-3 opacity-80 sm:size-4" />
          <p class="text-xs leading-none font-medium opacity-60 sm:text-sm">{{ item.label }}</p>
        </div>
      </template>
    </div>
  </div>
</template>
