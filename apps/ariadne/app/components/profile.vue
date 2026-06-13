<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import { Smile, X } from 'lucide-vue-next'
import type { MotionProps } from 'motion-v'

const { user } = useAuth()
const open = ref(false)

const transition: { [key: string]: MotionProps['transition'] } = {
  before: {
    layout: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
      mass: 0.7,
    },
  },
  after: {
    layout: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
}

const [DefineAvatar, ReuseAvatar] = createReusableTemplate<{ state: 'after' | 'before' }>()
</script>

<template>
  <DefineAvatar v-slot="{ state }">
    <AnimatePresence>
      <Motion as="div" layout-id="profile-avatar" :transition="transition[state]">
        <Avatar :class="state === 'after' ? 'size-24' : undefined">
          <!-- TODO: Put actual avatar -->
          <AvatarImage src="https://avatars.githubusercontent.com/u/122371060" />
          <AvatarFallback :delay-ms="SKELETON_DELAY_MS">{{ user?.initials }}</AvatarFallback>
        </Avatar>
      </Motion>
    </AnimatePresence>
  </DefineAvatar>

  <div class="relative flex">
    <Popover v-model:open="open">
      <!-- Dummy circle for before state of motion in popover -->
      <AnimatePresence>
        <Motion
          v-if="!open"
          as="div"
          layout-id="profile-popover"
          :style="{ borderRadius: '20px' }"
          :transition="transition['before']"
          class="bg-popover absolute inset-1"
        />
      </AnimatePresence>

      <PopoverTrigger as-child>
        <Button variant="ghost" size="icon" class="z-10">
          <ReuseAvatar v-if="!open" state="before" />
          <!-- To keep button size -->
          <Smile v-else />
        </Button>
      </PopoverTrigger>

      <PopoverAnchor class="absolute top-0 right-0 -mt-1.5 -mr-1.5 size-0" />

      <PopoverContent
        force-mount
        align="end"
        :side-offset="0"
        :avoid-collisions="false"
        class="pointer-events-none animate-none! bg-transparent p-0 shadow-none ring-0"
      >
        <Motion
          v-if="open"
          as="div"
          layout-id="profile-popover"
          :style="{ borderRadius: '16px' }"
          :transition="transition['after']"
          class="bg-popover border-border/40 pointer-events-auto relative flex flex-col gap-4 rounded-2xl border p-4 shadow-2xl"
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

          <!-- Header -->
          <div class="flex flex-col items-center gap-2">
            <ReuseAvatar state="after" />
            <p class="font-medium">{{ user?.fullName }}</p>
          </div>
        </Motion>
      </PopoverContent>
    </Popover>
  </div>
</template>
