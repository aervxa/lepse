<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

import { Plus } from 'lucide-vue-next'
import { formatDate } from '@vueuse/core'

const route = useRoute()
const { goals, fetchGoals } = useGoals()

const loadingGoals = ref(true)
fetchGoals().then(() => {
  loadingGoals.value = false
})
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
        <p class="text-3xl font-bold">Goals</p>
        <p class="text-muted-foreground">Manage what matters.</p>
      </div>
      <Button as-child>
        <NuxtLink to="/app/goals/create">
          <Plus />
          New Goal
        </NuxtLink>
      </Button>
    </div>

    <!-- Empty State -->
    <Empty v-if="goals.length === 0 && !loadingGoals" class="border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No Goals Yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any goals yet. Get started by creating your first goal.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button as-child>
          <NuxtLink to="/app/goals/create">
            <Plus />
            Create Goal
          </NuxtLink>
        </Button>
      </EmptyContent>
    </Empty>

    <!-- Goal List -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-4"
    >
      <div
        v-if="goals.length === 0 && loadingGoals"
        v-for="i in 5"
        :key="i"
        class="flex flex-col rounded-xl border hover:bg-muted/50"
      >
        <div class="flex flex-col gap-4 p-4">
          <Skeleton class="h-5 w-40" />
          <div class="flex flex-col gap-2">
            <Skeleton class="h-3 w-full" />
            <Skeleton class="h-3 w-1/3" />
          </div>
        </div>
        <Separator class="mt-auto" />
        <div class="flex items-center gap-2 justify-between p-3">
          <Skeleton class="h-3 w-16" />
          <Skeleton class="h-3 w-10" />
        </div>
      </div>

      <NuxtLink
        v-else
        v-for="goal in goals"
        :to="`/app/goals/${goal.id}`"
        :key="goal.id"
        class="flex flex-col rounded-xl border hover:bg-muted/50 focus-within:bg-muted/50"
      >
        <div class="flex flex-col gap-2 p-4">
          <p class="text-xl font-medium line-clamp-2">{{ goal.name }}</p>
          <p
            class="text-sm text-muted-foreground line-clamp-3"
            :class="goal.description ? '' : 'italic'"
          >
            {{ goal.description ?? 'No description provided.' }}
          </p>
        </div>
        <Separator class="mt-auto" />
        <div class="flex items-center gap-2 justify-between p-3">
          <GoalStatusDropdown :id="goal.id" :status="goal.status" />
          <p
            v-if="goal.createdAt"
            :title="`created: ${formatDate(new Date(goal.createdAt), 'MMM D YYYY, h:mm:ss A')}`"
            class="text-xs leading-none text-muted-foreground whitespace-nowrap"
          >
            {{ formatDate(new Date(goal.createdAt), 'MMM D') }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>

  <!-- Nested routes used for modals -->
  <NuxtPage />
</template>
