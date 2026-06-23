<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'

const route = useRoute()
const { id } = route.params
const source = inject(bubbleNavSourceKey)

const { tasks } = useTasks()
const task = computed(() => tasks.value.find((t) => t.id === Number(id)))
</script>

<template>
  <Button
    variant="link"
    size="sm"
    class="my-2 w-fit opacity-60"
    :class="[source === 'drawer' && 'mb-0']"
    @click="navigateBack()"
  >
    <ChevronLeft />
    Go back
  </Button>

  <div
    v-if="task"
    class="flex flex-1 flex-col justify-between gap-4"
    :class="[source === 'popover' && 'p-4 pt-0']"
  >
    <DrawerHeader v-if="source === 'drawer'" class="text-left!">
      <DrawerTitle class="text-2xl">{{ task.name }}</DrawerTitle>
      <DrawerDescription class="text-left text-base">
        {{ task.description ?? 'No description provided' }}
      </DrawerDescription>
    </DrawerHeader>
    <PopoverHeader v-if="source === 'popover'">
      <PopoverTitle class="text-2xl">{{ task.name }}</PopoverTitle>
      <PopoverDescription class="text-base">
        {{ task.description ?? 'No description provided' }}
      </PopoverDescription>
    </PopoverHeader>

    <div class="flex flex-col">
      <!-- TODO: Details -->
    </div>
  </div>
</template>
