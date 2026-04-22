<script setup lang="ts">
definePageMeta({
  nested: false,
})

const route = useRoute()
const { goals } = useGoals()
const goal = computed(() => goals.value.find((g) => g.id === Number(route.params.id)))
</script>

<template>
  <div class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 overflow-auto p-8">
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
      <p class="text-muted-foreground" :class="goal.description ? '' : 'italic'">
        {{ goal.description ?? 'No description provided.' }}
      </p>
    </template>
  </div>

  <NuxtPage />
</template>
