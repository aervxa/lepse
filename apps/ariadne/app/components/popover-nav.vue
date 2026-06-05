<script setup lang="ts">
import { Goal, ListTodo } from 'lucide-vue-next'
import { navigateBack } from '~/lib/utils'

const route = useRoute()

const itemsWrapper = ref<HTMLDivElement | null>(null)
const items = [
  { name: 'Tasks', path: '/shell/tasks', icon: ListTodo },
  { name: 'Goals', path: '/shell/goals', icon: Goal },
]
</script>

<template>
  <!-- A row for a "fake" popover anchor -->
  <div class="flex">
    <Popover
      @update:open="
        (value) => {
          value === false && navigateBack()
        }
      "
      :open="items.some((item) => route.path.startsWith(item.path))"
    >
      <PopoverAnchor />

      <PopoverContent
        class="mb-1 ml-6.5 w-96 max-w-[80vw]"
        @interact-outside="
          (event) => {
            if (itemsWrapper?.contains(event.target as Node)) {
              event.preventDefault()
            }
          }
        "
      >
        <NuxtPage keepalive />
      </PopoverContent>
    </Popover>

    <!-- List of buttons -->
    <div ref="itemsWrapper" class="relative flex gap-2">
      <Button
        v-for="item in items"
        :key="item.name"
        variant="outline"
        class="font-mono text-[11px] tracking-widest uppercase"
        @click="
          route.path.startsWith(item.path)
            ? navigateBack()
            : (navigateTo(item.path), console.log('navigated to', item.path))
        "
      >
        <component :is="item.icon" />
        {{ item.name }}
      </Button>
    </div>
  </div>
</template>
