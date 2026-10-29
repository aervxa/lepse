<script setup lang="ts">
import { X } from '@lucide/vue'
import { PopoverClose } from 'reka-ui'

const { $useSocketState } = useNuxtApp()

const source = inject(bubbleNavSourceKey)

const { user } = useAuth()

const { connection, join, leave, peers } = useLoungeClient()
const { state } = $useSocketState()
</script>

<template>
  <Gatekeep
    v-if="!user"
    title="You must be logged in to join lounges."
    action-label="Login"
    :action="async () => (await navigateTo('/'), await navigateTo('/login'))"
  />
  <Gatekeep v-else-if="!user.emailVerified" title="Please verify your email to join lounges." />
  <Gatekeep v-else-if="state !== 'connected'" title="Connecting to websocket..." />

  <div class="flex size-full flex-1 flex-col" :class="[source === 'drawer' && 'mx-auto max-w-sm']">
    <AnimatePresence mode="popLayout">
      <Motion
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
          <DrawerTitle class="text-2xl">Lounge</DrawerTitle>
          <DrawerDescription>Invite your friends to hangout.</DrawerDescription>
        </DrawerHeader>
        <PopoverHeader v-if="source === 'popover'" class="p-4 pb-2">
          <PopoverTitle class="text-2xl">Lounge</PopoverTitle>
          <PopoverDescription>Invite your friends to hangout.</PopoverDescription>
        </PopoverHeader>

        <div class="flex flex-1 flex-col justify-between p-4">
          <div class="flex justify-between">
            <LoadingButton @click="join('123')" :loading="connection === 'connecting'" force-slot>
              Join test lobby
            </LoadingButton>
            <Button
              variant="ghost-destructive"
              @click="leave()"
              :disabled="connection !== 'connected'"
            >
              Leave test lobby
            </Button>
          </div>

          <!-- Connected users -->
          <div v-if="connection === 'connected'" class="flex flex-col gap-2">
            <p class="mb-2">connected users:</p>
            <div v-for="p in peers" class="flex gap-2">
              <Avatar size="lg">
                <AvatarImage :src="p.user.avatarUrl ?? ''" />
                <AvatarFallback :delay-ms="SKELETON_DELAY_MS">
                  {{ p.user.initials ?? 'X' }}
                </AvatarFallback>
              </Avatar>
              <p>{{ p.user.name }}</p>
            </div>
          </div>
        </div>
      </Motion>
    </AnimatePresence>
  </div>
</template>
