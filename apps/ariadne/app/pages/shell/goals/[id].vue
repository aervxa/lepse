<script setup lang="ts">
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-vue-next'

const route = useRoute()
const { goals } = useGoals()
const { tasks } = useTasks()

const goal = computed(() => goals.value.find((g) => g.id === Number(route.params.id)))
const goalTasks = computed(() => tasks.value.filter((t) => t.goalId === goal.value?.id))
const goalTasksDone = computed(() => goalTasks.value.filter((t) => t.status === 'done').length)

const showTasks = ref(true)
</script>

<template>
  <div v-if="goal" class="flex flex-col gap-4">
    <!-- Header -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between">
        <div class="-ml-2 flex items-center">
          <!-- Close button -->
          <Button variant="ghost" size="icon-sm" @click="() => navigateBack()">
            <ChevronLeft />
          </Button>
          <p class="text-xl font-semibold">{{ goal.name }}</p>
        </div>
        <Button variant="outline" size="sm" as-child>
          <NuxtLink :to="`${goal.id}/edit`">
            <Pencil />
            Edit
          </NuxtLink>
        </Button>
      </div>
      <!-- Details -->
      <div class="flex gap-2">
        <!-- status -->
        <GoalStatusDropdown :id="goal.id" :status="goal.status" />
      </div>
    </div>

    <!-- Description -->
    <p class="text-muted-foreground" :class="goal.description ? '' : 'italic'">
      {{ goal.description ?? 'No description provided.' }}
    </p>

    <!-- Links -->
    <Collapsible v-model:open="showTasks">
      <div class="flex items-center justify-between gap-2">
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
          <span class="text-muted-foreground text-xs">
            {{ goalTasksDone }}/{{ goalTasks.length }}
          </span>
        </div>
      </div>
      <CollapsibleContent>
        <div class="flex flex-col pt-2">
          <TaskItem v-for="task in goalTasks" :key="task.id" :task="task" sub />
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
