<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import { ChevronLeft } from 'lucide-vue-next'

const route = useRoute()
const { id } = route.params
const source = inject(bubbleNavSourceKey)

const { tasks } = useTasks()
const task = computed(() => tasks.value.find((t) => t.id === Number(id)))

const now = new Date()
const date = computed(() => new Date(task.value?.createdAt ?? 0))
const formattedDate = computed(() =>
  formatDate(
    date.value,
    now.getFullYear() - date.value.getFullYear() > 0 ? 'MMM D, YYYYY' : 'MMM D'
  )
)
</script>

<template>
  <Button
    variant="link"
    size="sm"
    class="my-2 w-fit opacity-60"
    :class="[source === 'drawer' && 'mb-0']"
    @click="navigateBack()"
  >
    <ChevronLeft />
    Go back
  </Button>

  <div
    v-if="task"
    class="flex flex-1 flex-col gap-4 p-4"
    :class="[source === 'drawer' ? 'pt-1' : 'pt-0']"
  >
    <!-- Header -->
    <div class="flex flex-col gap-1.5">
      <p class="text-2xl font-medium">{{ task.name }}</p>
      <div class="flex items-center">
        <p class="text-xs font-light opacity-60">Linked to</p>
        <TaskGoalLink :id="task.id" />
      </div>
    </div>
    <p class="text-muted-foreground text-base" :class="[!task.description && 'italic']">
      {{ task.description ?? 'No description provided' }}
    </p>

    <Separator class="mt-auto opacity-50" />
    <div class="flex flex-col gap-1.5">
      <!-- TODO: TIME SPENT -->
      <!-- STATUS -->
      <div class="flex items-center gap-2">
        <p class="font-mono text-[10px] font-medium tracking-widest uppercase opacity-80">
          Status:
        </p>
        <TaskStatusDropdown :id="task.id" :status="task.status">
          <Button variant="outline" size="xs">
            <TaskStatusIcon :status="task.status" />
            {{ task.status }}
          </Button>
        </TaskStatusDropdown>
      </div>
      <!-- PRIORITY -->
      <div class="flex items-center gap-2">
        <p class="font-mono text-[10px] font-medium tracking-widest uppercase opacity-80">
          Priority:
        </p>
        <TaskPriorityDropdown :id="task.id" :priority="task.priority">
          <Button variant="outline" size="xs">
            <TaskPriorityIcon :priority="task.priority" />
            {{ task.priority }}
          </Button>
        </TaskPriorityDropdown>
      </div>
      <!-- CREATED AT -->
      <p class="text-muted-foreground mt-1 text-xs">Created at {{ formattedDate }}</p>
    </div>
  </div>
</template>
