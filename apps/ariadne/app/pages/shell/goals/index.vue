<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { PopoverClose } from 'reka-ui'

const { source } = defineProps<{ source: 'drawer' | 'popover' }>()

const { goals } = useGoals()
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
      <DrawerTitle>Goals</DrawerTitle>
      <DrawerDescription>Manage what matters.</DrawerDescription>
    </DrawerHeader>
    <PopoverHeader v-if="source === 'popover'">
      <PopoverTitle>Goals</PopoverTitle>
      <PopoverDescription>Manage what matters.</PopoverDescription>
    </PopoverHeader>

    <Motion as="div" class="flex flex-col gap-3" :class="[source === 'drawer' && 'p-4 pt-2']">
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
