<script setup lang="ts">
import { isTauri } from '@tauri-apps/api/core'
import { platform } from '@tauri-apps/plugin-os'
import { Image, MonitorCog, Pencil, User } from 'lucide-vue-next'

const headerItem = { name: 'Edit profile', path: '/shell/settings/profile', icon: Pencil }
const items = [
  { name: 'Account', path: '/shell/settings/account', icon: User },
  { name: 'Backgrounds', path: '/shell/settings/background', icon: Image },
  ...(isTauri()
    ? [{ name: `System (${platform()})`, path: '/shell/settings/app', icon: MonitorCog }]
    : []),
]
const item = computed(() => [...items, headerItem].find((i) => route.path.startsWith(i.path)))

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
    <DialogContent
      class="h-152 max-h-[calc(100%-2rem)] overflow-hidden p-0 sm:h-128 md:max-w-2xl lg:max-w-3xl"
    >
      <DialogTitle class="sr-only">Settings</DialogTitle>
      <DialogDescription class="sr-only">adjust ur likings and preferences</DialogDescription>

      <SidebarProvider class="min-h-full">
        <Sidebar collapsible="none" class="hidden border-r md:flex">
          <SidebarHeader v-if="headerItem">
            <SidebarMenuButton
              size="lg"
              class="group gap-3 rounded-tl-4xl"
              :is-active="route.path.startsWith(headerItem.path)"
              as-child
            >
              <NuxtLink :to="headerItem.path">
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
                    <span>{{ headerItem.name }}</span>
                    <component :is="headerItem.icon" class="size-3!" />
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

        <section class="md:bg-background relative flex flex-1 flex-col">
          <div class="border-border flex gap-2 border-b p-6">
            <DialogTitle>{{ item?.name }}</DialogTitle>
          </div>

          <ScrollArea class="flex-1">
            <div class="flex flex-1 flex-col gap-8 p-6">
              <NuxtPage />
            </div>
          </ScrollArea>
        </section>
      </SidebarProvider>
    </DialogContent>
  </Dialog>
</template>
