<script setup lang="ts">
import type { Data } from '@lepse/minos/data'
import { formatDate } from '@vueuse/core'
import { ChevronRight, Clock, ClockFading } from 'lucide-vue-next'
import { formatDuration } from '~/lib/time'

defineProps<{
  task: Data.Task
  sub?: boolean
}>()

const { goals } = useGoals()
</script>

<template>
  <NuxtLink
    :to="`/app/tasks/${task.id}`"
    class="flex items-center justify-between rounded-xl hover:bg-muted/50 focus-within:bg-muted/50"
    :class="sub ? 'px-2 py-1' : 'p-2 border'"
  >
    <div class="flex items-center gap-2">
      <!-- Priority Dropdown -->
      <template v-if="!sub">
        <TaskPriorityDropdown :id="task.id" :priority="task.priority" />
        <Separator orientation="vertical" />
      </template>

      <!-- Status Dropdown -->
      <TaskStatusDropdown :id="task.id" :status="task.status" />

      <p :class="sub ? 'text-sm font-medium' : 'font-semibold'">{{ task.name }}</p>

      <template v-if="task.goalId && !sub">
        <ChevronRight class="size-3 -mr-0.5 text-muted-foreground" />
        <p class="text-xs font-medium text-muted-foreground">
          {{ goals.find((goal) => goal.id === task.goalId)?.name }}
        </p>
      </template>
    </div>

    <!-- Additional info -->
    <div
      class="flex items-center justify-end min-w-0 gap-3 px-4 text-xs leading-none text-muted-foreground whitespace-nowrap"
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
