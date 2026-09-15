<script setup lang="ts">
import { getVersion, getName } from '@tauri-apps/api/app'
import { invoke, isTauri } from '@tauri-apps/api/core'
import { platform } from '@tauri-apps/plugin-os'
import { Image, MonitorCog, Palette, Pencil, User } from '@lucide/vue'

const route = useRoute()
const { user } = useAuth()
const container = useTemplateRef('container')

const headerItem = {
  name: 'Edit profile',
  path: '/settings/profile',
  icon: Pencil,
  disabled: computed(() => user.value === undefined),
}
const items = [
  {
    name: 'Account',
    path: '/settings/account',
    icon: User,
    disabled: computed(() => user.value === undefined),
  },
  {
    name: 'Appearance',
    path: '/settings/appearance',
    icon: Palette,
    disabled: computed(() => false),
  },
  {
    name: 'Backgrounds',
    path: '/settings/background',
    icon: Image,
    disabled: computed(() => false),
  },
  ...(isTauri()
    ? [
        {
          name: `System (${platform()})`,
          path: '/settings/system',
          icon: MonitorCog,
          disabled: computed(() => false),
        },
      ]
    : []),
]
const item = computed(() => [...items, headerItem].find((i) => route.path.startsWith(i.path)))

const open = computed({
  get: () => route.path.startsWith('/settings'),
  set: (value: boolean) => {
    if (!value && route.path.startsWith('/settings')) {
      navigateTo('/')
    }
    return !value
  },
})

// Open the sidebar on mobile only when coming "generally", and not to a specific page (/settings is written to redirect into /account)
const defaultMobileOpen = ref(false)
watch(open, () => {
  if (route.redirectedFrom?.path === '/settings') {
    defaultMobileOpen.value = true
  } else {
    defaultMobileOpen.value = false
  }
})

const appInfo = shallowRef<{
  os: string
  name: string
  version: string
}>()
onMounted(async () => {
  isTauri() &&
    (appInfo.value = {
      os: await invoke('get_os'),
      name: await getName(),
      version: await getVersion(),
    })
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      class="h-152 max-h-[calc(100%-2rem)] overflow-hidden p-0 sm:h-128 md:max-w-2xl lg:max-w-3xl"
    >
      <div ref="container" class="contents">
        <DialogTitle class="sr-only">Settings</DialogTitle>
        <DialogDescription class="sr-only">adjust ur likings and preferences</DialogDescription>

        <SidebarProvider :default-mobile-open class="min-h-full" v-slot="{ isMobile }">
          <Sidebar
            :container="container ?? undefined"
            :collapsible="isMobile ? 'offcanvas' : 'none'"
            class="hidden border-r md:flex"
          >
            <SidebarHeader v-if="headerItem">
              <SidebarMenuButton
                size="lg"
                class="group gap-3 rounded-tl-4xl"
                :is-active="route.path.startsWith(headerItem.path)"
                close-mobile-on-click
                as-child
                :aria-disabled="headerItem.disabled.value"
              >
                <NuxtLink :to="!headerItem.disabled.value ? headerItem.path : undefined">
                  <Avatar size="lg">
                    <AvatarImage :src="user?.avatarUrl ?? ''" />
                    <AvatarFallback :delay-ms="SKELETON_DELAY_MS">
                      {{ user?.initials ?? 'X' }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex flex-1 flex-col gap-1">
                    <span class="truncate text-xs tracking-wide">{{ user?.name ?? 'wraith' }}</span>
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
                      <SidebarMenuButton
                        :aria-disabled="item.disabled.value"
                        :is-active="route.path.startsWith(item.path)"
                        close-mobile-on-click
                        as-child
                      >
                        <NuxtLink :to="!item.disabled.value ? item.path : undefined">
                          <component :is="item.icon" />
                          <span>{{ item.name }}</span>
                        </NuxtLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter v-if="appInfo" class="flex-row items-center px-4 py-2">
              <!-- TODO: make button do smt cool -->
              <Button variant="ghost" size="icon-lg">
                <img src="/favicon.svg" class="size-7" />
              </Button>
              <div class="text-muted-foreground flex flex-col gap-1.5 *:leading-none *:capitalize">
                <p class="text-sm">{{ appInfo.name }} {{ appInfo.version }}</p>
                <p class="text-[11px] font-light">{{ appInfo.os }}</p>
              </div>
            </SidebarFooter>
          </Sidebar>

          <section class="md:bg-background relative flex flex-1 flex-col">
            <div class="border-border flex items-center gap-2 border-b px-6 py-4">
              <SidebarTrigger v-if="isMobile" />
              <DialogTitle class="leading-8">{{ item?.name }}</DialogTitle>
            </div>

            <ScrollArea class="flex-1">
              <div class="flex flex-1 flex-col gap-8 p-6">
                <NuxtPage />
              </div>
            </ScrollArea>
          </section>
        </SidebarProvider>
      </div>
    </DialogContent>
  </Dialog>
</template>
