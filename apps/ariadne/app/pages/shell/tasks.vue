<script setup lang="ts">
import { ChevronRight, X } from 'lucide-vue-next'
import { PopoverClose } from 'reka-ui'

const source = inject(bubbleNavSourceKey)

const route = useRoute()
const { tasks } = useTasks()

const inSubpage = computed(() => /tasks\/\d+/.test(route.path))

const [subpage, animateSubpage] = useAnimate()
const openSubpage = () => {
  animateSubpage(
    subpage.value,
    {
      opacity: [0, 1],
      x: ['2rem', 0],
      filter: ['blur(4px)', 'blur(0px)'],
    },
    contentTransition.in()
  )
}
</script>

<template>
  <div class="flex size-full flex-1 flex-col" :class="[source === 'drawer' && 'mx-auto max-w-sm']">
    <AnimatePresence mode="popLayout">
      <Motion
        v-show="!inSubpage"
        as="div"
        class="flex flex-1 flex-col"
        :initial="{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }"
        :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: contentTransition.in() }"
        :exit="{
          opacity: 0,
          scale: 0.95,
          filter: 'blur(4px)',
          transition: contentTransition.out(),
        }"
      >
        <!-- Close button -->
        <PopoverClose v-if="source === 'popover'" as-child>
          <Button variant="ghost" size="icon" class="absolute top-1.5 right-1.5">
            <X />
          </Button>
        </PopoverClose>

        <!-- Heading -->
        <DrawerHeader v-if="source === 'drawer'">
          <DrawerTitle class="text-2xl">Tasks</DrawerTitle>
          <DrawerDescription>Manage your focus and productivity.</DrawerDescription>
        </DrawerHeader>
        <PopoverHeader v-if="source === 'popover'" class="p-4 pb-2">
          <PopoverTitle class="text-2xl">Tasks</PopoverTitle>
          <PopoverDescription>Manage your focus and productivity.</PopoverDescription>
        </PopoverHeader>

        <!-- List | relative/absolute wrapper to force contenteditable p tag into a fixed space (otherwise grows parent) -->
        <div class="relative flex-1">
          <div class="absolute inset-0">
            <ScrollArea class="size-full">
              <div class="flex flex-col gap-3 p-4">
                <Item v-for="task in tasks" :key="task.id" variant="outline" size="sm" as-child>
                  <NuxtLink :to="`/shell/tasks/${task.id}`" @click="openSubpage">
                    <!-- Task status  -->
                    <ItemMedia class="-my-3 -mr-1.5">
                      <TaskStatusDropdown :id="task.id" :status="task.status" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{{ task.name }}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <ChevronRight class="size-4" />
                    </ItemActions>
                  </NuxtLink>
                </Item>
              </div>
            </ScrollArea>
          </div>
        </div>
      </Motion>

      <!-- item page -->
      <Motion
        v-show="inSubpage"
        as="div"
        ref="subpage"
        class="flex flex-1 flex-col"
        :initial="{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }"
        :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: contentTransition.in() }"
      >
        <NuxtPage />
      </Motion>
    </AnimatePresence>
  </div>
</template>
