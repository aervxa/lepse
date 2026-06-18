<script setup lang="ts">
import type { Data } from '@lepse/minos/data'
import { formatDate } from '@vueuse/core'
import { ChevronRight, Clock, ClockFading } from 'lucide-vue-next'
import { formatDuration } from '~/lib/time'

defineProps<{
  task: Data.Task
  sub?: boolean
  disableControls?: boolean
}>()

const { goals } = useGoals()
</script>

<template>
  <NuxtLink
    :to="`/shell/tasks/${task.id}`"
    class="hover:bg-muted/50 focus-within:bg-muted/50 flex items-center justify-between rounded-xl"
    :class="sub ? 'px-2 py-1' : 'border p-2'"
  >
    <div class="flex items-center gap-2">
      <!-- Priority Dropdown -->
      <template v-if="!sub">
        <TaskPriorityDropdown :id="task.id" :priority="task.priority" :disabled="disableControls" />
        <Separator orientation="vertical" />
      </template>

      <!-- Status Dropdown -->
      <TaskStatusDropdown :id="task.id" :status="task.status" :disabled="disableControls" />

      <p :class="sub ? 'text-sm font-medium' : 'font-semibold'">{{ task.name }}</p>

      <template v-if="task.goalId && !sub">
        <ChevronRight class="text-muted-foreground -mr-0.5 size-3" />
        <p class="text-muted-foreground text-xs font-medium">
          {{ goals.find((goal) => goal.id === task.goalId)?.name }}
        </p>
      </template>
    </div>

    <!-- Additional info -->
    <div
      class="text-muted-foreground flex min-w-0 items-center justify-end gap-3 px-4 text-xs leading-none whitespace-nowrap"
    >
      <div class="flex items-center gap-1.5" title="time worked">
        <Clock class="size-3" />
        <p>
          {{
            formatDuration(task.stopwatchMs, {
              format: 'hhh mmm',
              pad: false,
            })
          }}
        </p>
      </div>
      <div class="flex items-center gap-1.5" title="pomos completed">
        <ClockFading class="size-3" />
        <p>{{ task.pomoCount }} pomos</p>
      </div>
      <template v-if="!sub">
        <Separator orientation="vertical" />
        <p
          v-if="task.createdAt"
          :title="`created: ${formatDate(new Date(task.createdAt), 'MMM D YYYY, h:mm:ss A')}`"
        >
          {{ formatDate(new Date(task.createdAt), 'MMM D') }}
        </p>
      </template>
    </div>
  </NuxtLink>
</template>
