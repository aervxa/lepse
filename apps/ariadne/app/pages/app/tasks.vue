<script setup lang="ts">
import { Plus, Clock, ClockFading } from 'lucide-vue-next'
import { formatDate } from '@vueuse/core'
import { formatDuration } from '~/lib/time'

const route = useRoute()
const { tasks, fetchTasks } = useTasks()
await fetchTasks()
</script>

<template>
  <!-- Remove nested "layout" if nested is set to false -->
  <div
    v-if="route.meta.nested !== false"
    class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 overflow-auto p-8"
  >
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-3xl font-bold">Tasks</p>
        <p class="text-muted-foreground">Manage your focus and productivity.</p>
      </div>
      <Button as-child>
        <NuxtLink to="/app/tasks/create">
          <Plus />
          New Task
        </NuxtLink>
      </Button>
    </div>

    <!-- Empty State -->
    <Empty v-if="tasks.length === 0" class="border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No Tasks Yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any tasks yet. Get started by creating your first task.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button as-child>
          <NuxtLink to="/app/tasks/create">
            <Plus />
            Create Task
          </NuxtLink>
        </Button>
      </EmptyContent>
    </Empty>

    <!-- Task List -->
    <div v-else class="flex flex-col gap-2">
      <NuxtLink
        v-for="task in tasks"
        :to="`/app/tasks/${task.id}`"
        :key="task.id"
        class="group/task relative flex items-center justify-between rounded-xl border p-2 hover:bg-muted/50 focus-within:bg-muted/50"
      >
        <div class="flex items-center gap-2">
          <!-- Priority Dropdown -->
          <TaskPriorityDropdown :id="task.id" :priority="task.priority" />

          <Separator orientation="vertical" />

          <!-- Status Dropdown -->
          <TaskStatusDropdown :id="task.id" :status="task.status" />

          <p class="font-semibold">{{ task.name }}</p>
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
          <Separator orientation="vertical" />
          <p
            v-if="task.createdAt"
            :title="`created: ${formatDate(new Date(task.createdAt), 'MMM D YYYY, h:mm:ss A')}`"
          >
            {{ formatDate(new Date(task.createdAt), 'MMM D') }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>

  <!-- Nested routes used for modals -->
  <NuxtPage />
</template>
