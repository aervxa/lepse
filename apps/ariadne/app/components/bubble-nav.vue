<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { Goal, ListTodo } from 'lucide-vue-next'
import { navigateBack } from '~/lib/utils'

const route = useRoute()

const btnWrapper = ref<HTMLDivElement | null>(null)
const items = [
  { name: 'Tasks', path: '/shell/tasks', icon: ListTodo },
  { name: 'Goals', path: '/shell/goals', icon: Goal },
]

const onOpenUpdate = (value: boolean) => {
  value === false && isBubbleOpen.value === true && navigateBack()
}
const isBubbleOpen = computed(() => items.some((item) => route.path.startsWith(item.path)))

const { width } = useWindowSize()
const float = computed(() => width.value >= 640)
</script>

<template>
  <!-- Wrapper to group popover's anchor together with the items -->
  <div
    class="flex"
    :class="[float ? 'absolute top-1/2 left-10 -translate-1/2 flex-col' : 'relative']"
  >
    <Popover v-if="float" :open="isBubbleOpen" @update:open="onOpenUpdate">
      <PopoverAnchor class="pointer-events-none absolute inset-0" />

      <PopoverContent
        side="right"
        align="center"
        class="ml-1 w-96"
        @interact-outside="
          (event) => {
            const target = event.target as HTMLElement
            // prevent outisde interaction closing popover if the user clicks another item (exclude the wrapper for the space)
            if (
              btnWrapper !== target &&
              btnWrapper?.contains(target) &&
              route.path.startsWith(target.closest('button')?.dataset.path ?? '') // ignore only the related button
            ) {
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
    <div ref="btnWrapper" class="flex gap-2" :class="[float && 'flex-col']">
      <Button
        v-for="item in items"
        :key="item.name"
        variant="outline"
        :size="float ? 'icon' : undefined"
        class="font-mono text-[11px] tracking-widest uppercase"
        @click="route.path.startsWith(item.path) ? navigateBack() : navigateTo(item.path)"
        :data-path="item.path"
      >
        <component :is="item.icon" />
        <span class="sm:hidden">{{ item.name }}</span>
      </Button>
    </div>
  </div>
</template>
