<script setup lang="ts">
const { source } = defineProps<{ source: 'drawer' | 'popover' }>()

const { goals } = useGoals()
</script>

<template>
  <div :class="[source === 'drawer' ? 'mx-auto w-full max-w-sm' : 'contents']">
    <DrawerHeader v-if="source === 'drawer'">
      <DrawerTitle>Goals</DrawerTitle>
      <DrawerDescription>Manage what matters.</DrawerDescription>
    </DrawerHeader>
    <PopoverHeader v-if="source === 'popover'">
      <PopoverTitle>Goals</PopoverTitle>
      <PopoverDescription>Manage what matters.</PopoverDescription>
    </PopoverHeader>

    <div class="flex flex-col gap-3" :class="[source === 'drawer' && 'p-4 pt-2']">
      <Item v-for="goal in goals" :key="goal.id" variant="outline" as-child>
        <NuxtLink :to="`goals/${goal.id}`">
          <ItemContent>
            <ItemTitle>{{ goal.name }}</ItemTitle>
            <ItemDescription :class="[!goal.description && 'text-muted-foreground italic']">
              {{ goal.description ?? 'No description provided' }}
            </ItemDescription>
          </ItemContent>
        </NuxtLink>
      </Item>
    </div>
  </div>
</template>
