<script setup lang="ts">
import { useFullscreen, useWindowSize } from '@vueuse/core'
import { Goal, ListTodo } from 'lucide-vue-next'
import type { FocusOutsideEvent } from 'reka-ui'

const items = [
  { name: 'tasks', path: '/tasks', icon: ListTodo },
  { name: 'goals', path: '/goals', icon: Goal },
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
    navigateTo('/')
    activeItem.value = undefined
  }
})

// Change activeItem on route changes
watch(route, (value) => {
  activeItem.value = items.find((item) => value.path.startsWith(item.path))
  // if no active item, close popover
  if (!activeItem.value) open.value = false
  else if (open.value === false) {
    openNav(activeItem.value)
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
  if (
    (target !== nav.value && nav.value?.contains(target)) ||
    target.dataset.slot === 'popover-trigger'
  ) {
    event.preventDefault()
  }
}

const { isFullscreen } = useFullscreen()
</script>

<template>
  <div
    ref="nav"
    class="peer flex gap-1 rounded-full"
    :class="[
      mode !== 'drawer-bottom' &&
        'border-border absolute top-1/2 -translate-y-1/2 flex-col border p-1 backdrop-blur-lg **:backdrop-blur-none' +
          ' ' +
          (isFullscreen ? 'left-4' : 'left-2'),
    ]"
  >
    <Motion
      v-if="!open && mode !== 'drawer-bottom'"
      as="div"
      layout-id="bubble-popover"
      :style="{ borderRadius: '24px' }"
      :transition="popoverTransition.before()"
      class="bg-sidebar/60 pointer-events-none absolute inset-0 -z-10"
    />

    <div v-for="item in items" :key="item.name" class="relative">
      <AnimatePresence>
        <Motion
          v-if="mode === 'popover' && activeItem?.name === item.name"
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
          class="bg-primary/25 border-border/60 absolute -inset-0.5 -z-10 rounded-full border"
        />
      </AnimatePresence>

      <Button
        :variant="mode === 'drawer-bottom' ? 'secondary' : 'ghost'"
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
        :side-offset="isFullscreen ? 12 : 8"
        unstyled
        class="aspect-4/5 max-h-[67vh] w-sm"
        :class="[!open && 'pointer-events-none']"
        @interact-outside="focusOutside"
      >
        <Motion
          v-if="open"
          as="div"
          layout-id="bubble-popover"
          :style="{ borderRadius: '16px' }"
          :transition="popoverTransition.after()"
          class="border-border/40 bg-popover/80 relative z-100 h-full overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-3xl"
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
