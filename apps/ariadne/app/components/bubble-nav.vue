<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { Goal, ListTodo } from 'lucide-vue-next'
import type { FocusOutsideEvent } from 'reka-ui'

const items = [
  { name: 'tasks', path: '/shell/tasks', icon: ListTodo },
  { name: 'goals', path: '/shell/goals', icon: Goal },
]
type Item = (typeof items)[number]

const { width } = useWindowSize()
const mode = computed<'drawer-bottom' | 'drawer-left' | 'popover'>(() =>
  width.value < BREAKPOINTS.sm
    ? 'drawer-bottom'
    : width.value < BREAKPOINTS.xl
      ? 'drawer-left'
      : 'popover'
)
const source = computed(() => (mode.value.startsWith('drawer') ? 'drawer' : 'popover'))
provide(bubbleNavSourceKey, readonly(source))
const route = useRoute()
const nav = useTemplateRef('nav')
const open = ref(false)
const activeItem = ref<Item>()

onMounted(() => {
  openNav(items.find((item) => route.path.startsWith(item.path)))
})

watch(open, async (value) => {
  if (!value) {
    navigateTo('/shell')
    activeItem.value = undefined
  }
})

async function openNav(item?: Item) {
  if (!item) return

  // If popover is open
  if (open.value) {
    // close popover if activeItem is the invoker
    if (activeItem.value?.name === item.name) {
      open.value = false
    } else {
      navigateTo(item.path)
    }
  } else {
    // Let nested slugs remain on reloads
    if (!new RegExp(`${item.path}/\\d+`).test(route.path)) {
      await navigateTo(item.path)
    }
    open.value = true
  }

  activeItem.value = item
}

function focusOutside(event: FocusOutsideEvent) {
  const target = event.target as HTMLElement
  if (target !== nav.value && nav.value?.contains(target)) {
    event.preventDefault()
  }
}
</script>

<template>
  <div
    ref="nav"
    class="peer flex gap-1 rounded-full"
    :class="[
      mode !== 'drawer-bottom' && 'absolute top-1/2 left-2 -translate-y-1/2 flex-col',
      mode === 'popover' && 'border-border border p-1',
    ]"
    :data-float="mode !== 'drawer-bottom'"
  >
    <Motion
      v-if="!open && mode === 'popover'"
      as="div"
      layout-id="bubble-popover"
      :style="{ borderRadius: '24px' }"
      :transition="popoverTransition.before()"
      class="bg-sidebar pointer-events-none absolute inset-0 -z-10"
    />

    <div v-for="item in items" :key="item.name" class="relative">
      <AnimatePresence>
        <Motion
          v-if="activeItem?.name === item.name"
          as="div"
          layout-id="bubble-nav-item"
          :exit="{ scale: 0 }"
          :transition="{
            layout: {
              type: 'spring',
              bounce: 0.4,
              duration: 0.4,
            },
          }"
          class="bg-popover border-border/60 absolute -inset-0.5 -z-10 rounded-full border"
        />
      </AnimatePresence>

      <Button
        :variant="mode === 'popover' ? 'ghost' : 'outline'"
        :size="mode !== 'drawer-bottom' ? 'icon' : undefined"
        @click="openNav(item)"
      >
        <component :is="item.icon" />
        <span :class="[mode !== 'drawer-bottom' && 'sr-only']">{{ item.name }}</span>
      </Button>
    </div>

    <Popover v-if="mode === 'popover'" v-model:open="open">
      <PopoverAnchor class="pointer-events-none absolute inset-0" />
      <PopoverContent
        force-mount
        side="right"
        align="center"
        :side-offset="8"
        unstyled
        class="aspect-4/5 max-h-[67vh] w-sm"
        @interact-outside="focusOutside"
      >
        <Motion
          v-if="open"
          as="div"
          layout-id="bubble-popover"
          :style="{ borderRadius: '16px' }"
          :transition="popoverTransition.after()"
          class="border-border/40 bg-popover relative z-100 h-full overflow-hidden rounded-2xl border shadow-2xl"
        >
          <NuxtPage />
        </Motion>
      </PopoverContent>
    </Popover>
    <Drawer
      v-else
      v-model:open="open"
      should-scale-background
      :direction="mode === 'drawer-bottom' ? 'bottom' : 'left'"
    >
      <DrawerContent class="min-h-[67vh]">
        <NuxtPage />
      </DrawerContent>
    </Drawer>
  </div>
</template>
