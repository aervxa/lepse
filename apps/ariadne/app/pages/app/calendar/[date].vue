<script setup lang="ts">
import { getClientDate } from '~/lib/utils'

definePageMeta({
  layout: 'app',
  validate: (route) => route.params.date === getClientDate(route.params.date as string),
})

const route = useRoute()
const { tasks } = useTasks()
const { dayTasks, createDayTask } = useDay(route.params.date as string)

const expandedDayTasks = computed(() =>
  dayTasks.value.map((dt) => {
    const task = tasks.value.find((t) => t.id === dt.taskId)
    return {
      ...dt,
      task: task ? { ...task, status: dt.status } : null,
    }
  })
)
</script>

<template>
  <p>{{ route.params.date }}</p>
  <div class="flex flex-col gap-4">
    <Combobox
      :items="tasks"
      empty="No tasks found."
      placeholder="Select a task for today..."
      @select="
        (item) => {
          createDayTask({ taskId: item.id })
        }
      "
    >
      <Button variant="outline" size="sm"> add </Button>
    </Combobox>

    <div v-for="dayTask in expandedDayTasks" :key="dayTask.id">
      <p>- {{ getClientDate(dayTask.date) }}</p>
      <TaskItem v-if="dayTask.task" :task="dayTask.task" />
    </div>
  </div>
</template>
