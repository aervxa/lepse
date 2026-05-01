<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import {
  CalendarDays,
  ListTodo,
  NotebookPen,
  Repeat2,
  Target,
  Timer,
  Loader,
  LogOut,
} from 'lucide-vue-next'
import logoSrc from '~/assets/images/logo.png'

const groups = [
  {
    label: null,
    items: [
      { label: 'Calendar', icon: CalendarDays, route: '/app/calendar' },
      { label: 'Focus', icon: Timer, route: '/app/focus' },
      { label: 'Journal', icon: NotebookPen, route: '/app/journal' },
    ],
  },
  {
    label: 'Plan',
    items: [
      { label: 'Goals', icon: Target, route: '/app/goals' },
      { label: 'Tasks', icon: ListTodo, route: '/app/tasks' },
      { label: 'Habits', icon: Repeat2, route: '/app/habits' },
    ],
  },
]

const route = useRoute()

const loggingOut = ref(false)
const logout = async () => {
  loggingOut.value = true
  await useAuth().logout()
  loggingOut.value = false
}

const sidebarKind = useLocalStorage<'inset' | 'floating'>('sidebar_kind', 'floating')
const toggleSidebarKind = () => {
  sidebarKind.value = sidebarKind.value === 'inset' ? 'floating' : 'inset'
}
</script>

<template>
  <SidebarProvider>
    <Sidebar :variant="sidebarKind" collapsible="icon">
      <SidebarHeader v-if="sidebarKind === 'inset'">
        <NuxtLink to="/app" class="px-3 py-2 w-fit">
          <img :src="logoSrc" class="h-10 not-dark:invert" />
        </NuxtLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup v-for="group in groups" :key="group.label ?? 'none'">
          <SidebarGroupLabel v-if="group.label">{{ group.label }}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in group.items" :key="item.label">
                <SidebarMenuButton as-child :is-active="route.path.startsWith(item.route)">
                  <NuxtLink :to="item.route">
                    <component :is="item.icon" />
                    {{ item.label }}
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div class="flex justify-between flex-wrap gap-2">
          <SidebarKindToggle
            @click="toggleSidebarKind"
            :expandSidebar="sidebarKind === 'floating'"
          />

          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="outline" size="icon-sm">
                <Loader v-if="loggingOut" class="animate-spin" />
                <LogOut v-else />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will end this session and return you to the login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction as-child variant="destructive">
                  <Button @click="logout">Logout</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SidebarFooter>
    </Sidebar>

    <SidebarInset>
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
