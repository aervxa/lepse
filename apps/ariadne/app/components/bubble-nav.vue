<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { Goal, ListTodo } from 'lucide-vue-next'
import { navigateBack } from '~/lib/utils'

const route = useRoute()

const itemsWrapper = ref<HTMLDivElement | null>(null)
const items = [
  { name: 'Tasks', path: '/shell/tasks', icon: ListTodo },
  { name: 'Goals', path: '/shell/goals', icon: Goal },
]

const onOpenUpdate = (value: boolean) => {
  value === false && isBubbleOpen.value === true && navigateBack()
}
const isBubbleOpen = computed(() => items.some((item) => route.path.startsWith(item.path)))

const { width } = useWindowSize()
</script>

<template>
  <!-- Wrapper to group popover's anchor together with the items -->
  <div class="flex">
    <Popover v-if="width >= 640" :open="isBubbleOpen" @update:open="onOpenUpdate">
      <PopoverAnchor />

      <PopoverContent
        class="mb-1 ml-6.5 w-96"
        @interact-outside="
          (event) => {
            const target = event.target as Node
            // prevent outisde interaction closing popover if the user clicks another item (exclude the wrapper for the space)
            if (itemsWrapper !== target && itemsWrapper?.contains(target)) {
              event.preventDefault()
            }
          }
        "
      >
        <NuxtPage source="popover" />
      </PopoverContent>
    </Popover>

    <Drawer v-else :open="isBubbleOpen" @update:open="onOpenUpdate">
      <DrawerContent>
        <NuxtPage source="drawer" />
      </DrawerContent>
    </Drawer>

    <!-- List of buttons -->
    <div ref="itemsWrapper" class="relative flex gap-2">
      <Button
        v-for="item in items"
        :key="item.name"
        variant="outline"
        class="font-mono text-[11px] tracking-widest uppercase"
        @click="route.path.startsWith(item.path) ? navigateBack() : navigateTo(item.path)"
      >
        <component :is="item.icon" />
        {{ item.name }}
      </Button>
    </div>
  </div>
</template>
