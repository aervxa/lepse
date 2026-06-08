<script setup lang="ts">
const { source } = defineProps<{ source: 'drawer' | 'popover' }>()

const { tasks } = useTasks()
</script>

<template>
  <div :class="[source === 'drawer' ? 'mx-auto w-full max-w-sm' : 'contents']">
    <DrawerHeader v-if="source === 'drawer'">
      <DrawerTitle>Tasks</DrawerTitle>
      <DrawerDescription>Manage your focus and productivity.</DrawerDescription>
    </DrawerHeader>
    <PopoverHeader v-if="source === 'popover'">
      <PopoverTitle>Tasks</PopoverTitle>
      <PopoverDescription>Manage your focus and productivity.</PopoverDescription>
    </PopoverHeader>

    <div class="flex flex-col gap-3" :class="[source === 'drawer' && 'p-4']">
      <Item v-for="task in tasks" :key="task.id" variant="outline" as-child>
        <NuxtLink :to="`tasks/${task.id}`">
          <ItemContent>
            <ItemTitle>{{ task.name }}</ItemTitle>
            <ItemDescription :class="[!task.description && 'text-muted-foreground italic']">
              {{ task.description ?? 'No description provided' }}
            </ItemDescription>
          </ItemContent>
        </NuxtLink>
      </Item>
    </div>
  </div>
</template>
