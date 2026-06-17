<script setup lang="ts">
const { source } = defineProps<{ source: 'drawer' | 'popover' }>()

const { goals } = useGoals()
</script>

<template>
  <div :class="[source === 'drawer' ? 'mx-auto w-full max-w-sm' : 'flex flex-col gap-6']">
    <DrawerHeader v-if="source === 'drawer'">
      <DrawerTitle>Goals</DrawerTitle>
      <DrawerDescription>Manage what matters.</DrawerDescription>
    </DrawerHeader>
    <PopoverHeader v-if="source === 'popover'">
      <PopoverTitle>Goals</PopoverTitle>
      <PopoverDescription>Manage what matters.</PopoverDescription>
    </PopoverHeader>

    <Motion
      as="div"
      layout
      class="flex flex-col gap-3"
      :class="[source === 'drawer' && 'p-4 pt-2']"
    >
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
    </Motion>
  </div>
</template>
