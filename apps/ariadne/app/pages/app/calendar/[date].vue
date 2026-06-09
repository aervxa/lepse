<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import { ChevronRight, Clock, ClockFading, Plus } from 'lucide-vue-next'
import { formatDuration } from '~/lib/time'

definePageMeta({
  layout: 'app',
  key: (route) => route.fullPath,
  validate: (route) => route.params.date === getClientDate(route.params.date as string),
})

const day = useRoute().params.date as string

const { tasks } = useTasks()
const { dayTasks, createDayTask, focusSession, fetchFocusSession } = useDay(day)
const { focusSessions } = useFocusSessions()

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
const isToday = computed(() => day === getClientDate())

onMounted(() => {
  if (!focusSessions.value.some((fs) => fs.date?.startsWith(day))) {
    fetchFocusSession()
  }
})
</script>

<template>
  <Dialog :open="true" @update:open="useRouter().back()">
    <DialogContent>
      <DialogHeader>
        <DialogTitle class="text-lg">
          {{ formatDate(new Date(day), 'dddd, MMMM D, YYYY') }}
        </DialogTitle>
        <DialogDescription>
          View and manage tasks for {{ isToday ? 'today' : 'this day' }}.
        </DialogDescription>

        <div class="text-muted-foreground flex gap-3 text-xs leading-none whitespace-nowrap">
          <div class="flex items-center gap-1.5" title="time worked">
            <Clock class="size-3" />
            <p>
              {{
                formatDuration(focusSession?.stopwatchMs ?? 0, {
                  format: 'hhh mmm',
                  pad: false,
                })
              }}
            </p>
          </div>
          <div class="flex items-center gap-1.5" title="pomos completed">
            <ClockFading class="size-3" />
            <p>{{ focusSession?.pomoCount ?? 0 }} pomos</p>
          </div>
        </div>
      </DialogHeader>

      <Collapsible v-model:open="showTasks">
        <div class="flex items-center justify-between gap-2">
          <CollapsibleTrigger as-child>
            <Button variant="ghost" size="xs">
              <ChevronRight class="transition-transform" :class="[showTasks && 'rotate-90']" />
              Tasks
            </Button>
          </CollapsibleTrigger>

          <Combobox
            v-if="isToday"
            :items="tasks"
            empty="No tasks found."
            :placeholder="`Select a task for ${isToday ? 'today' : 'this day'}...`"
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
        <CollapsibleContent class="flex flex-col pt-2">
          <template v-if="expandedDayTasks.length" v-for="dayTask in expandedDayTasks">
            <TaskItem
              v-if="dayTask.task"
              :key="dayTask.id"
              :task="dayTask.task"
              sub
              :disable-controls="day !== getClientDate()"
            />
          </template>
          <Empty v-else>
            <EmptyHeader>
              <EmptyTitle>No tasks found.</EmptyTitle>
              <EmptyDescription v-if="isToday">
                Select a task from the dropdown to add it to today's schedule.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CollapsibleContent>
      </Collapsible>
    </DialogContent>
  </Dialog>
</template>
