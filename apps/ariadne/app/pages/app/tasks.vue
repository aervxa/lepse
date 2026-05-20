<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

import { Plus } from 'lucide-vue-next'

const route = useRoute()
const { tasks, fetchTasks } = useTasks()

const loadingTasks = ref(true)
fetchTasks().then(() => {
  loadingTasks.value = false
})
</script>

<template>
  <AppPage>
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
    <Empty v-if="tasks.length === 0 && !loadingTasks" class="border border-dashed">
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
    <div class="flex flex-col gap-2">
      <Skeleton v-if="tasks.length === 0 && loadingTasks" v-for="i in 4" :key="i" />
      <TaskItem v-else v-for="task in tasks" :key="task.id" :task="task" />
    </div>
  </AppPage>
</template>
