<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'

const route = useRoute()
const { id } = route.params
const source = inject(bubbleNavSourceKey)

const { goals } = useGoals()
const goal = computed(() => goals.value.find((t) => t.id === Number(id)))
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

  <div v-if="goal" class="flex flex-1 flex-col gap-4" :class="[source === 'popover' && 'p-4 pt-0']">
    <DrawerHeader v-if="source === 'drawer'" class="text-left!">
      <DrawerTitle class="text-2xl">{{ goal.name }}</DrawerTitle>
      <DrawerDescription class="text-left text-base">
        {{ goal.description ?? 'No description provided' }}
      </DrawerDescription>
    </DrawerHeader>
    <PopoverHeader v-if="source === 'popover'">
      <PopoverTitle class="text-2xl">{{ goal.name }}</PopoverTitle>
      <PopoverDescription class="text-base">
        {{ goal.description ?? 'No description provided' }}
      </PopoverDescription>
    </PopoverHeader>

    <!-- TODO: linked tasks -->

    <div class="mt-auto flex flex-col">
      <!-- TODO: Details -->
    </div>
  </div>
</template>
