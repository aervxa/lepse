<script setup lang="ts">
import { isTauri } from '@tauri-apps/api/core'
import { Image, MonitorCog, Pencil, User } from 'lucide-vue-next'

const items = [
  { name: 'Account', path: '/shell/settings/account', icon: User },
  { name: 'Background', path: '/shell/settings/background', icon: Image },
  ...(isTauri() ? [{ name: 'System', path: '/shell/settings/app', icon: MonitorCog }] : []),
]

const route = useRoute()

const open = computed({
  get: () => route.path.startsWith('/shell/settings'),
  set: (value: boolean) => {
    if (!value && route.path.startsWith('/shell/settings')) {
      navigateTo('/shell')
    }
    return !value
  },
})

const { user } = useAuth()
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="min-h-152 overflow-hidden p-0 sm:min-h-128 md:max-w-2xl lg:max-w-3xl">
      <DialogTitle class="sr-only">Settings</DialogTitle>
      <DialogDescription class="sr-only">adjust ur likings and preferences</DialogDescription>

      <SidebarProvider class="min-h-full">
        <Sidebar collapsible="none" class="hidden border-r md:flex">
          <SidebarHeader>
            <SidebarMenuButton
              size="lg"
              class="group gap-3 rounded-tl-4xl"
              :is-active="route.path.startsWith('/shell/settings/profile')"
              as-child
            >
              <NuxtLink to="/shell/settings/profile">
                <Avatar size="lg">
                  <AvatarImage :src="user?.avatarUrl ?? ''" />
                  <AvatarFallback :delay-ms="SKELETON_DELAY_MS">
                    {{ user?.initials }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex flex-1 flex-col gap-1">
                  <span class="truncate text-xs tracking-wide">{{ user?.fullName }}</span>
                  <div
                    class="group-hover:text-foreground text-muted-foreground flex items-center gap-1 text-xs leading-none font-light"
                  >
                    <span>Edit Profile</span>
                    <Pencil class="size-3!" />
                  </div>
                </div>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem v-for="item in items" :key="item.name">
                    <SidebarMenuButton :is-active="route.path.startsWith(item.path)" as-child>
                      <NuxtLink :to="item.path">
                        <component :is="item.icon" />
                        <span>{{ item.name }}</span>
                      </NuxtLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <section class="md:bg-background flex flex-1 flex-col gap-8 p-6">
          <NuxtPage />
        </section>
      </SidebarProvider>
    </DialogContent>
  </Dialog>
</template>
