<script setup lang="ts">
import { ChevronRight, X } from 'lucide-vue-next'
import { PopoverClose } from 'reka-ui'

const source = inject(bubbleNavSourceKey)

const route = useRoute()
const { goals } = useGoals()

const inSubpage = computed(() => /goals\/\d+/.test(route.path))
</script>
<template>
  <div class="flex size-full flex-1 flex-col" :class="[source === 'drawer' && 'mx-auto max-w-sm']">
    <AnimatePresence mode="popLayout">
      <Motion
        v-if="!inSubpage"
        as="div"
        class="flex flex-1 flex-col"
        :class="[source === 'popover' && 'gap-6 p-4']"
        :initial="{ opacity: 0, x: '-1rem', scale: 0.95, filter: 'blur(4px)' }"
        :animate="{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }"
        :exit="{ opacity: 0, x: '-1rem', scale: 0.95, filter: 'blur(4px)' }"
        :transition="!inSubpage ? contentTransition.in() : contentTransition.out()"
      >
        <!-- Close button -->
        <PopoverClose v-if="source === 'popover'" as-child>
          <Button variant="ghost" size="icon" class="absolute top-1.5 right-1.5">
            <X />
          </Button>
        </PopoverClose>

        <!-- Heading -->
        <DrawerHeader v-if="source === 'drawer'">
          <DrawerTitle class="text-2xl">Goals</DrawerTitle>
          <DrawerDescription>Manage what matters.</DrawerDescription>
        </DrawerHeader>
        <PopoverHeader v-if="source === 'popover'">
          <PopoverTitle class="text-2xl">Goals</PopoverTitle>
          <PopoverDescription>Manage what matters.</PopoverDescription>
        </PopoverHeader>

        <!-- List -->
        <div class="flex flex-col gap-3" :class="[source === 'drawer' && 'p-4 pt-2']">
          <Item v-for="goal in goals" :key="goal.id" variant="outline" as-child>
            <NuxtLink :to="`/shell/goals/${goal.id}`">
              <ItemMedia>
                <!-- TODO: Goal status -->
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{{ goal.name }}</ItemTitle>
                <ItemDescription :class="[!goal.description && 'text-muted-foreground italic']">
                  {{ goal.description ?? 'No description provided' }}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRight class="size-4" />
              </ItemActions>
            </NuxtLink>
          </Item>
        </div>
      </Motion>

      <!-- item page -->
      <Motion
        v-if="inSubpage"
        as="div"
        class="flex flex-1 flex-col"
        :initial="{ opacity: 0, x: '2rem', filter: 'blur(4px)' }"
        :animate="{ opacity: 1, x: 0, filter: 'blur(0px)' }"
        :exit="{ opacity: 0, x: '2rem', filter: 'blur(4px)' }"
        :transition="inSubpage ? contentTransition.in() : contentTransition.out()"
      >
        <NuxtPage />
      </Motion>
    </AnimatePresence>
  </div>
</template>
