<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

import { Plus } from 'lucide-vue-next'

const route = useRoute()
const { habits, fetchHabits } = useHabits()

const loadingHabits = ref(true)
fetchHabits().then(() => {
  loadingHabits.value = false
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
        <p class="text-3xl font-bold">Habits</p>
        <p class="text-muted-foreground">Manage your habits.</p>
      </div>
      <Button as-child>
        <NuxtLink to="/app/habits/create">
          <Plus />
          New Habit
        </NuxtLink>
      </Button>
    </div>

    <!-- Empty State -->
    <Empty v-if="habits.length === 0 && !loadingHabits" class="border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No Habits Yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any habits yet. Get started by creating your first habit.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button as-child>
          <NuxtLink to="/app/habits/create">
            <Plus />
            Create Habit
          </NuxtLink>
        </Button>
      </EmptyContent>
    </Empty>

    <!-- Habit List -->
    <div v-else class="flex flex-col gap-2">
      <Skeleton v-if="habits.length === 0 && loadingHabits" v-for="i in 4" :key="i" />
      <HabitItem v-else v-for="habit in habits" :key="habit.id" :habit="habit" />
    </div>
    <!-- <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-4"
    >
      <div
        v-if="habits.length === 0 && loadingHabits"
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
        v-for="habit in habits"
        :to="`/app/habits/${habit.id}`"
        :key="habit.id"
        class="flex flex-col rounded-xl border hover:bg-muted/50 focus-within:bg-muted/50"
      >
        <div class="flex flex-col gap-2 p-4">
          <p class="text-xl font-medium line-clamp-2">{{ habit.name }}</p>
          <p
            class="text-sm text-muted-foreground line-clamp-3"
            :class="habit.description ? '' : 'italic'"
          >
            {{ habit.description ?? 'No description provided.' }}
          </p>
        </div>
        <Separator class="mt-auto" />
        <div class="flex items-center gap-2 justify-between p-3">
          <Badge variant="secondary" class="uppercase font-mono">{{ habit.frequency }}</Badge>
          <p
            v-if="habit.createdAt"
            :title="`created: ${formatDate(new Date(habit.createdAt), 'MMM D YYYY, h:mm:ss A')}`"
            class="text-xs leading-none text-muted-foreground whitespace-nowrap"
          >
            {{ formatDate(new Date(habit.createdAt), 'MMM D') }}
          </p>
        </div>
      </NuxtLink>
    </div> -->
  </div>

  <!-- Nested routes used for modals -->
  <NuxtPage />
</template>
