<script setup lang="ts">
import { Goal, ListTodo } from 'lucide-vue-next'
import { navigateBack } from '~/lib/utils'

const route = useRoute()

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
          !value && navigateBack()
        }
      "
      :open="items.map((i) => i.path).some((path) => route.path.startsWith(path))"
    >
      <PopoverAnchor />

      <PopoverContent class="mb-1 ml-6.5">
        <NuxtPage />
      </PopoverContent>
    </Popover>

    <!-- List of buttons -->
    <div class="relative flex gap-2">
      <Button
        v-for="item in items"
        :key="item.name"
        variant="outline"
        class="font-mono text-[11px] tracking-widest uppercase"
        @click="navigateTo(item.path)"
      >
        <component :is="item.icon" />
        {{ item.name }}
      </Button>
    </div>
  </div>
</template>
