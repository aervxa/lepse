<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import { Calculator, Clock, ClockFading, Hourglass, Pencil, Focus } from 'lucide-vue-next'
import { formatDuration } from '~/lib/time'

definePageMeta({
  nested: false,
})

const route = useRoute()
const { tasks } = useTasks()
const task = computed(() => tasks.value.find((t) => t.id === Number(route.params.id)))
</script>

<template>
  <div class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 overflow-auto p-8">
    <template v-if="task">
      <!-- Header -->
      <div class="flex flex-col gap-1">
        <div class="flex justify-between">
          <p class="text-3xl font-semibold">{{ task.name }}</p>
          <div class="flex gap-2">
            <Button variant="outline" as-child>
              <NuxtLink :to="`/app/tasks/${task.id}/edit`">
                <Pencil />
                Edit
              </NuxtLink>
            </Button>
            <Button as-child>
              <NuxtLink :to="`/app/focus?focus&task=${task.id}`">
                <Focus />
                Focus
              </NuxtLink>
            </Button>
          </div>
        </div>
        <div class="flex gap-2">
          <!-- Priority and status -->
          <TaskPriorityDropdown :id="task.id" :priority="task.priority">
            <Button variant="outline" size="xs">
              <TaskPriorityIcon :priority="task.priority" />
              {{ task.priority }}
            </Button>
          </TaskPriorityDropdown>
          <TaskStatusDropdown :id="task.id" :status="task.status">
            <Button variant="outline" size="xs">
              <TaskStatusIcon :status="task.status" />
              {{ task.status }}
            </Button>
          </TaskStatusDropdown>

          <!-- Additional info -->
          <div
            class="flex items-center gap-3 ps-2 text-xs leading-none text-muted-foreground whitespace-nowrap"
          >
            <div v-if="task.deadline" class="flex items-center gap-1.5" title="deadline">
              <Hourglass class="size-3" />
              <p>{{ formatDate(new Date(task.deadline), 'MMM D') }}</p>
            </div>
            <div v-if="task.timeEstimateMin" class="flex items-center gap-1.5" title="estimate">
              <Calculator class="size-3" />
              <p>{{ task.timeEstimateMin }}m</p>
            </div>
            <Separator orientation="vertical" class="first:hidden" />
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
        </div>
      </div>
      <p class="text-muted-foreground" :class="task.description ? '' : 'italic'">
        {{ task.description ?? 'No description provided.' }}
      </p>
    </template>
  </div>

  <NuxtPage />
</template>
