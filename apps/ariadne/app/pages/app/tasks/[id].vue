<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import {
  ArrowUpRight,
  Calculator,
  Clock,
  ClockFading,
  Focus,
  Hourglass,
  Link,
  Pencil,
  Unlink,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { formatDuration } from '~/lib/time'

definePageMeta({
  nested: false,
})

const route = useRoute()
const { tasks, updateTask } = useTasks()
const { goals } = useGoals()

const task = computed(() => tasks.value.find((t) => t.id === Number(route.params.id)))
const goal = computed(() => goals.value.find((g) => g.id === task.value?.goalId))

const linkGoal = async (goalId: number | null) => {
  if (task.value) {
    const error = await updateTask(task.value?.id, { goalId })
    if (error) toast.error('Failed to link goal.')
    else toast.success(goalId === null ? 'Task goal unlinked.' : 'Task goal linked.')
  }
}
</script>

<template>
  <AppPage nested>
    <template v-if="task">
      <!-- Header -->
      <div class="flex flex-col gap-2">
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

        <div class="flex flex-col gap-2">
          <!-- Additional info -->
          <div class="flex gap-2">
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

            <!-- Goal Link -->
            <ContextMenu v-if="goal">
              <ContextMenuTrigger as-child>
                <Button variant="outline" size="xs" as-child>
                  <NuxtLink :to="`/app/goals/${goal.id}`">
                    <Link />
                    {{ goal.name }}
                  </NuxtLink>
                </Button>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem as-child>
                  <NuxtLink :to="`/app/goals/${goal.id}`">
                    <ArrowUpRight />
                    Open goal
                  </NuxtLink>
                </ContextMenuItem>
                <ContextMenuItem @select="linkGoal(null)">
                  <Unlink />
                  Unlink
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            <Combobox
              v-else
              :items="goals"
              empty="No goal found."
              placeholder="Select a goal..."
              @select="
                (item) => {
                  linkGoal(item.id)
                }
              "
            >
              <Button variant="outline" size="xs">
                <Link />
                <span class="italic text-muted-foreground">Unlinked</span>
              </Button>
            </Combobox>
          </div>
        </div>
      </div>
      <p class="text-muted-foreground" :class="task.description ? '' : 'italic'">
        {{ task.description ?? 'No description provided.' }}
      </p>
    </template>
  </AppPage>
</template>
