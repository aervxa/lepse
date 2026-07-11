<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  SquareDashedTopSolid,
  SquaresIntersect,
  X,
} from 'lucide-vue-next'

const router = useRouter()
const { user } = useAuth()
const { backgrounds } = useBackgrounds()

// ─── Tauri ──────────────────────────────────────────────────────── start ───

import { isTauri } from '@tauri-apps/api/core'
import type { UnlistenFn } from '@tauri-apps/api/event'
import { getCurrentWebviewWindow, type WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { platform, type Platform } from '@tauri-apps/plugin-os'

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
  <main class="flex h-dvh flex-col" :class="[os === 'windows' ? 'bg-transparent' : 'bg-sidebar']">
    <div
      v-if="isApp"
      data-slot="titlebar"
      data-tauri-drag-region
      class="-mb-2 flex h-8 items-center justify-between select-none"
    >
      <!-- <img :src="logoSrc" class="h-full not-dark:invert pointer-events-none" /> -->
      <div class="px-2">
        <Button variant="ghost" size="icon-xs" tabindex="-1" @click="router.back()">
          <ArrowLeft />
        </Button>
        <Button variant="ghost" size="icon-xs" tabindex="-1" @click="router.forward()">
          <ArrowRight />
        </Button>
      </div>
      <div class="pointer-events-auto z-377 [&>button]:rounded-none">
        <Button
          variant="ghost"
          size="icon-sm"
          tabindex="-1"
          @click="appWindow?.minimize()"
          class="text-muted-foreground"
        >
          <Minus />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          tabindex="-1"
          @click="appWindow?.toggleMaximize()"
          class="text-muted-foreground"
        >
          <SquaresIntersect v-if="isAppMaximized" />
          <SquareDashedTopSolid v-else />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          tabindex="-1"
          @click="appWindow?.close()"
          class="text-muted-foreground hover:text-destructive w-10 pr-2 hover:[&>svg]:stroke-3"
        >
          <X />
        </Button>
      </div>
    </div>

    <!-- Main App -->
    <section
      data-vaul-drawer-wrapper
      class="relative z-0 m-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border-2 p-4"
    >
      <div class="absolute inset-0 -z-10">
        <img
          :src="
            backgrounds.find((b) => b.id === user?.backgroundId)?.url ||
            '/images/backgrounds/02-rooftop-garden.png' /* TODO: Replace default background with an 'intro' one */
          "
          class="pointer-events-none size-full object-cover select-none"
        />
      </div>
      <slot />
    </section>
  </main>
</template>
