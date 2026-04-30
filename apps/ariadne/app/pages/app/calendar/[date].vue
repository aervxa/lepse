<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import { ChevronRight, Plus } from 'lucide-vue-next'
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

const showTasks = ref(true)
</script>

<template>
  <Dialog :open="true" @update:open="useRouter().back()">
    <DialogContent>
      <DialogHeader>
        <DialogTitle class="text-lg">
          {{ formatDate(new Date(route.params.date as string), 'dddd, MMMM D, YYYY') }}
        </DialogTitle>
        <DialogDescription>View and manage tasks for this day.</DialogDescription>
      </DialogHeader>

      <Collapsible v-model:open="showTasks">
        <div class="flex items-center gap-2 justify-between">
          <CollapsibleTrigger as-child>
            <Button variant="ghost" size="xs">
              <ChevronRight class="transition-transform" :class="[showTasks && 'rotate-90']" />
              Tasks
            </Button>
          </CollapsibleTrigger>

          <Combobox
            :items="tasks"
            empty="No tasks found."
            placeholder="Select a task for today..."
            align="end"
            @select="
              (item) => {
                createDayTask({ taskId: item.id })
              }
            "
          >
            <Button variant="outline" size="icon-xs">
              <Plus />
            </Button>
          </Combobox>
        </div>
        <CollapsibleContent class="pt-2 flex flex-col">
          <template v-if="expandedDayTasks.length" v-for="dayTask in expandedDayTasks">
            <TaskItem
              v-if="dayTask.task"
              :key="dayTask.id"
              :task="dayTask.task"
              sub
              :disable-controls="route.params.date !== getClientDate()"
            />
          </template>
          <Empty v-else>
            <EmptyHeader>
              <EmptyTitle>No tasks found.</EmptyTitle>
              <EmptyDescription>
                Select a task from the dropdown to add it to today's schedule.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CollapsibleContent>
      </Collapsible>
    </DialogContent>
  </Dialog>
</template>
