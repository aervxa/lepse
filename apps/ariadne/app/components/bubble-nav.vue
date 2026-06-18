<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { Goal, ListTodo, X } from 'lucide-vue-next'
import type { FocusOutsideEvent } from 'reka-ui'

const route = useRoute()
const { width } = useWindowSize()

const float = computed(() => width.value >= 768)
const items = [
  { name: 'tasks', path: '/shell/tasks', icon: ListTodo },
  { name: 'goals', path: '/shell/goals', icon: Goal },
]

const open = ref(false)
const wrapper = useTemplateRef('wrapper')
const activeIndex = ref(-1)

onMounted(() => {
  activeIndex.value = items.findIndex((item) => route.path.startsWith(item.path))
})

watch(activeIndex, () => {
  nextTick().then(() => {
    setTimeout(() => {
      if (activeIndex.value > -1) {
        navigateTo(items[activeIndex.value]!.path)
        open.value = true
      } else {
        open.value = false
        navigateTo('/shell')
      }
    })
  })
})

const handleInteractOutside = (e: FocusOutsideEvent) => {
  if (!open.value) return
  const target = e.target as HTMLElement
  if (wrapper.value !== target && wrapper.value?.contains(target)) {
    e.preventDefault()
  } else {
    navigateTo('/shell')
  }
}
</script>

<template>
  <!-- Trigger wrapper -->
  <div
    ref="wrapper"
    class="peer flex gap-2"
    :class="[float && 'absolute top-1/2 left-3 -translate-y-1/2 flex-col']"
    :data-float="float"
  >
    <!-- Triggers -->
    <template v-for="(item, index) in items" :key="item.name">
      <div class="relative flex">
        <!-- Dummy circle for before state of motion in popover -->
        <Motion
          v-if="!open && activeIndex === index"
          as="div"
          layout-id="bubble-popover"
          :style="{ borderRadius: '20px' }"
          :transition="popoverTransition.before()"
          class="bg-popover absolute inset-0"
          @layout-animation-complete="!open && (activeIndex = -1)"
        />

        <Button
          variant="outline"
          :size="float ? 'icon' : undefined"
          class="z-10"
          :class="[float && 'bg-popover font-mono text-[11px] tracking-widest uppercase']"
          @click="activeIndex = activeIndex === index ? -1 : index"
        >
          <component :is="item.icon" />
          <template v-if="!float">{{ item.name }}</template>
        </Button>
      </div>
    </template>

    <Popover v-if="float" v-model:open="open">
      <PopoverAnchor class="absolute top-1/2 left-full size-0" />

      <PopoverContent
        force-mount
        side="right"
        align="center"
        :side-offset="8"
        unstyled
        @interact-outside="(e) => handleInteractOutside(e)"
      >
        <Motion
          v-if="open"
          as="div"
          layout-id="bubble-popover"
          :style="{ borderRadius: '16px' }"
          :transition="popoverTransition.after()"
          class="border-border/40 bg-popover relative z-100 w-96 overflow-clip rounded-2xl border p-4 shadow-2xl"
        >
          <!-- Close button -->
          <Button
            variant="ghost"
            size="icon"
            class="absolute top-1.5 right-1.5"
            @click="open = false"
          >
            <X />
          </Button>

          <NuxtPage source="popover" v-slot="{ Component }">
            <Transition name="blurfade" appear>
              <component :is="Component" :key="route.path" source="popover" />
            </Transition>
          </NuxtPage>
        </Motion>
      </PopoverContent>
    </Popover>

    <Drawer v-else v-model:open="open" should-scale-background>
      <DrawerContent>
        <NuxtPage source="drawer" />
      </DrawerContent>
    </Drawer>
  </div>
</template>

<style>
.blurfade-enter-active,
.blurfade-leave-active {
  transition: all 0.25s;
}

.blurfade-enter-from,
.blurfade-leave-to {
  opacity: 0;
  filter: blur(0.4rem);
  transform: scale(0.95);
}
</style>
