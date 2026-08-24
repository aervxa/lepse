<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import { LogOut, Pencil, Settings, Smile, X } from '@lucide/vue'

const { user, logoutMutation } = useAuth()
const open = ref(false)

const [DefineAvatar, ReuseAvatar] = createReusableTemplate<{ state: 'after' | 'before' }>({
  inheritAttrs: false, // defining state as a runtime prop isn't needed since no attrs need to be inherited
})
</script>

<template>
  <DefineAvatar v-slot="{ state }">
    <AnimatePresence>
      <Motion
        as="div"
        layout-id="profile-avatar"
        :transition="popoverTransition[state]()"
        class="rounded-full"
      >
        <Avatar :class="state === 'after' ? 'size-24' : undefined">
          <AvatarImage :src="user?.avatarUrl ?? ''" />
          <AvatarFallback :delay-ms="SKELETON_DELAY_MS">{{ user?.initials }}</AvatarFallback>
        </Avatar>
      </Motion>
    </AnimatePresence>
  </DefineAvatar>

  <div class="relative flex">
    <Popover v-model:open="open">
      <!-- Dummy circle for before state of motion in popover -->
      <Motion
        v-if="!open"
        as="div"
        layout-id="profile-popover"
        :style="{ borderRadius: '20px' }"
        :transition="popoverTransition.before()"
        class="bg-popover absolute inset-1"
      />

      <PopoverTrigger as-child>
        <Button variant="ghost" size="icon">
          <ReuseAvatar v-if="!open" state="before" />
          <!-- To keep button size -->
          <Smile v-else />
        </Button>
      </PopoverTrigger>

      <PopoverAnchor class="absolute top-0 right-0 -mt-1.5 -mr-1.5 size-0" />

      <PopoverContent force-mount align="end" :side-offset="0" unstyled>
        <Motion
          v-if="open"
          as="div"
          layout-id="profile-popover"
          :style="{ borderRadius: '16px' }"
          :transition="popoverTransition.after()"
          class="bg-popover/80 border-border/40 relative flex flex-col gap-6 rounded-2xl border p-4 shadow-2xl backdrop-blur-3xl"
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
            <div class="group relative rounded-full">
              <ReuseAvatar state="after" />
              <NuxtLink
                to="/settings/profile"
                class="focus absolute inset-0 rounded-full **:transition-all"
              >
                <div
                  class="bg-background/50 group-hover:bg-muted/50 group-focus-within:bg-muted/50 absolute right-[14.645%] bottom-[14.645%] translate-1/2 rounded-full p-2 backdrop-blur-lg"
                >
                  <Pencil class="size-3 group-hover:stroke-3" />
                </div>
              </NuxtLink>
            </div>
            <p class="font-medium">Hi, {{ user?.name }}!</p>
          </div>

          <div class="flex items-end justify-between gap-2">
            <div class="flex gap-2">
              <Button variant="outline" size="sm" as-child>
                <NuxtLink to="/settings">
                  <Settings />
                  Settings
                </NuxtLink>
              </Button>
            </div>
            <LoadingButton
              variant="destructive"
              size="icon-sm"
              :loading="logoutMutation.isPending.value"
              @click="
                dialog({
                  title: 'Are you sure you want to logout?',
                  description: 'This will end this session and return you to the login page.',
                  action: 'Logout',
                }).then((v) => v && logoutMutation.mutate({}))
              "
            >
              <LogOut />
            </LoadingButton>
          </div>
        </Motion>
      </PopoverContent>
    </Popover>
  </div>
</template>
