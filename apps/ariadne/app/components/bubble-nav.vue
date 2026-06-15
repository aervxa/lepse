<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { Goal, ListTodo, X } from 'lucide-vue-next'

const route = useRoute()
const { width } = useWindowSize()
const float = computed(() => width.value >= 768)

const items = [
  { name: 'tasks', path: '/shell/tasks', icon: ListTodo, open: ref(false) },
  { name: 'goals', path: '/shell/goals', icon: Goal, open: ref(false) },
]

const onOpenUpdate = (value: boolean, path: string) => {
  if (value === true) {
    navigateTo(path)
  } else if (route.path.startsWith(path)) {
    navigateTo('/shell')
  }
}
</script>

<template>
  <!-- Trigger wrapper (lol) -->
  <div
    class="peer flex gap-2"
    :class="[float && 'absolute top-1/2 left-3 -translate-y-1/2 flex-col']"
    :data-float="float"
  >
    <!-- Nav item (per) -->
    <div v-for="item in items" :key="item.name" class="relative flex">
      <Popover
        v-if="float"
        v-model:open="item.open.value"
        @update:open="(v) => onOpenUpdate(v, item.path)"
      >
        <!-- Dummy circle for before state of motion in popover -->
        <Motion
          v-if="!item.open.value"
          as="div"
          :layout-id="item.name + '-bubble-popover'"
          :style="{ borderRadius: '20px' }"
          :transition="popoverTransition.before()"
          class="bg-popover absolute inset-0"
        />

        <PopoverTrigger as-child>
          <Button variant="outline" size="icon" class="z-10">
            <component :is="item.icon" />
          </Button>
        </PopoverTrigger>

        <PopoverAnchor class="absolute top-1/2 left-0 size-0 -translate-y-1/2" />

        <PopoverContent force-mount side="right" align="center" :side-offset="0" unstyled>
          <Motion
            v-if="item.open.value"
            as="div"
            :layout-id="item.name + '-bubble-popover'"
            :style="{ borderRadius: '16px' }"
            :transition="popoverTransition.after()"
            class="border-border/40 bg-popover relative z-100 flex h-128 w-96 flex-col gap-6 rounded-2xl border p-4 shadow-2xl"
          >
            <!-- Close button -->
            <Button
              variant="ghost"
              size="icon"
              class="absolute top-1.5 right-1.5"
              @click="item.open.value = false"
            >
              <X />
            </Button>

            <NuxtPage source="popover" />
          </Motion>
        </PopoverContent>
      </Popover>

      <Drawer
        v-else
        v-model:open="item.open.value"
        @update:open="(v) => onOpenUpdate(v, item.path)"
        should-scale-background
      >
        <DrawerTrigger>
          <Button variant="outline" class="font-mono text-[11px] tracking-widest uppercase">
            <component :is="item.icon" />
            <template v-if="!float">{{ item.name }}</template>
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <NuxtPage source="drawer" />
        </DrawerContent>
      </Drawer>
    </div>
  </div>
</template>
