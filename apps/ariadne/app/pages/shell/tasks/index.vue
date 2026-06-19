<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { PopoverClose } from 'reka-ui'

const { source } = defineProps<{ source: 'drawer' | 'popover' }>()

const { tasks } = useTasks()
</script>

<template>
  <div
    class="relative flex size-full flex-col"
    :class="[source === 'drawer' ? 'mx-auto max-w-sm' : 'gap-6 p-4']"
  >
    <!-- Close button -->
    <PopoverClose v-if="source === 'popover'" as-child>
      <Button variant="ghost" size="icon" class="absolute top-1.5 right-1.5">
        <X />
      </Button>
    </PopoverClose>

    <DrawerHeader v-if="source === 'drawer'">
      <DrawerTitle>Tasks</DrawerTitle>
      <DrawerDescription>Manage your focus and productivity.</DrawerDescription>
    </DrawerHeader>
    <PopoverHeader v-if="source === 'popover'">
      <PopoverTitle>Tasks</PopoverTitle>
      <PopoverDescription>Manage your focus and productivity.</PopoverDescription>
    </PopoverHeader>

    <Motion as="div" class="flex flex-col gap-3" :class="[source === 'drawer' && 'p-4 pt-2']">
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
    </Motion>
  </div>
</template>
