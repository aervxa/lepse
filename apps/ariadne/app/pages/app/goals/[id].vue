<script setup lang="ts">
import { ChevronRight, Pencil } from 'lucide-vue-next'

definePageMeta({
  nested: false,
})

const route = useRoute()
const { goals } = useGoals()
const { tasks } = useTasks()

const goal = computed(() => goals.value.find((g) => g.id === Number(route.params.id)))
const goalTasks = computed(() => tasks.value.filter((t) => t.goalId === goal.value?.id))
const goalTasksDone = computed(() => goalTasks.value.filter((t) => t.status === 'done').length)

const showTasks = ref(true)
</script>

<template>
  <AppPage>
    <template v-if="goal">
      <!-- Header -->
      <div class="flex flex-col gap-1">
        <div class="flex justify-between">
          <p class="text-3xl font-semibold">{{ goal.name }}</p>
          <Button variant="outline" as-child>
            <NuxtLink :to="`/app/goals/${goal.id}/edit`">
              <Pencil />
              Edit
            </NuxtLink>
          </Button>
        </div>
        <div class="flex gap-2">
          <!-- status -->
          <GoalStatusDropdown :id="goal.id" :status="goal.status" />
        </div>
      </div>
      <p class="-mt-2 text-muted-foreground" :class="goal.description ? '' : 'italic'">
        {{ goal.description ?? 'No description provided.' }}
      </p>

      <Collapsible v-model:open="showTasks">
        <div class="flex items-center gap-2 justify-between">
          <CollapsibleTrigger as-child>
            <Button variant="ghost" size="xs">
              <ChevronRight class="transition-transform" :class="[showTasks && 'rotate-90']" />
              Tasks
            </Button>
          </CollapsibleTrigger>

          <div class="flex items-center gap-1.5 pr-6">
            <CircularProgress
              :value="Math.max(4, (goalTasksDone / goalTasks.length) * 100)"
              :size="12"
              :thickness="1.5"
            />
            <span class="text-xs text-muted-foreground">
              {{ goalTasksDone }}/{{ goalTasks.length }}
            </span>
          </div>
        </div>
        <CollapsibleContent>
          <div class="pt-2 flex flex-col">
            <TaskItem v-for="task in goalTasks" :key="task.id" :task="task" sub />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </template>
  </AppPage>
</template>
