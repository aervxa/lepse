<script setup lang="ts">
import { Minus, SquareDashedTopSolid, SquaresIntersect, X } from 'lucide-vue-next'
import { isTauri } from '@tauri-apps/api/core'
import { platform, type Platform } from '@tauri-apps/plugin-os'
import { getCurrentWebviewWindow, type WebviewWindow } from '@tauri-apps/api/webviewWindow'
import type { UnlistenFn } from '@tauri-apps/api/event'
import { useFullscreen } from '@vueuse/core'

const { user } = useAuth()
const { backgrounds, activeBackgroundId } = useBackgrounds()
const { windowTransparency } = useSettings()
const { isFullscreen } = useFullscreen()

const showSkeleton = ref(false)
onMounted(() => {
  setTimeout(() => {
    showSkeleton.value = true
  }, SKELETON_DELAY_MS)
})

// ─── Tauri ──────────────────────────────────────────────────────── start ───

const isApp = isTauri()
const isAppMaximized = ref(false)
let os: Platform | undefined
let appWindow: WebviewWindow | undefined
let unlisten: UnlistenFn | undefined

onBeforeMount(async () => {
  if (isApp) {
    os = platform()
    appWindow = getCurrentWebviewWindow()
    isAppMaximized.value = await appWindow.isMaximized()

    unlisten = await appWindow?.onResized(async () => {
      isAppMaximized.value = (await appWindow?.isMaximized()) ?? false
    })
  }
})

onBeforeUnmount(() => {
  unlisten?.()
})

// ─── Tauri ────────────────────────────────────────────────────────── end ───
</script>

<template>
  <main
    class="flex h-dvh flex-col"
    :class="[
      os === 'windows' ? 'bg-transparent' : windowTransparency ? 'bg-sidebar/60' : 'bg-sidebar',
    ]"
  >
    <div
      v-if="isApp"
      v-show="!isFullscreen"
      data-slot="titlebar"
      data-tauri-drag-region
      class="-mb-2 flex h-8 items-center justify-between"
      @pointerdown.stop
    >
      <div class="pointer-events-none px-2">
        <img src="/favicon.svg" class="size-5 grayscale" />
      </div>
      <div
        v-if="appWindow"
        class="z-377 [&>button]:pointer-events-auto [&>button]:rounded-none [&>button]:backdrop-blur-none"
      >
        <Button
          variant="ghost"
          size="icon-sm"
          tabindex="-1"
          @click="appWindow.minimize()"
          class="text-muted-foreground"
        >
          <Minus />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          tabindex="-1"
          @click="appWindow.toggleMaximize()"
          class="text-muted-foreground"
        >
          <SquaresIntersect v-if="isAppMaximized" />
          <SquareDashedTopSolid v-else />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          tabindex="-1"
          @click="appWindow.close()"
          class="text-muted-foreground hover:text-destructive w-10 pr-2 hover:[&>svg]:stroke-3"
        >
          <X />
        </Button>
      </div>
    </div>

    <!-- Main App -->
    <section
      data-vaul-drawer-wrapper
      class="bg-background outline-border/50 relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden outline-2"
      :class="[!isFullscreen && 'm-2 rounded-lg']"
    >
      <div class="absolute inset-0 -z-10">
        <Image
          v-if="activeBackgroundId"
          :src="backgrounds.find((b) => b.id === activeBackgroundId)?.url"
          class="pointer-events-none -z-10 size-full object-cover"
        />
      </div>

      <ScrollArea class="flex-1">
        <div
          class="relative flex min-h-128 min-w-md flex-1 flex-col"
          :class="[isFullscreen ? 'p-6' : 'p-4']"
        >
          <slot />
        </div>

        <!-- No need for vertical scrollbar since it exists by default -->
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Item
        v-if="user && !user?.emailVerified"
        variant="outline"
        class="bg-card/90 absolute top-4 left-1/2 w-sm -translate-x-1/2 backdrop-blur-lg"
      >
        <ItemContent>
          <ItemTitle>Please verify your email!</ItemTitle>
          <ItemDescription>Check if we already sent you a link</ItemDescription>
        </ItemContent>
        <ItemActions>
          <EmailVerifyButton />
        </ItemActions>
      </Item>

      <Item
        v-if="user && !user?.backgroundId"
        variant="outline"
        class="bg-card/80 absolute bottom-4 left-1/2 w-sm -translate-x-1/2 backdrop-blur-lg"
      >
        <ItemContent>
          <ItemTitle>You haven't selected a background!</ItemTitle>
          <ItemDescription>No worries, we'll pick a random one.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" as-child>
            <NuxtLink to="/shell/settings/background">Select</NuxtLink>
          </Button>
        </ItemActions>
      </Item>
    </section>
  </main>
</template>
