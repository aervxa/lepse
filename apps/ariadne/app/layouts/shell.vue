<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  SquareDashedTopSolid,
  SquaresIntersect,
  X,
} from 'lucide-vue-next'
import { isTauri } from '@tauri-apps/api/core'
import { platform, type Platform } from '@tauri-apps/plugin-os'
import { getCurrentWebviewWindow, type WebviewWindow } from '@tauri-apps/api/webviewWindow'
import type { UnlistenFn } from '@tauri-apps/api/event'
import { useFullscreen } from '@vueuse/core'

const { user } = useAuth()
const { backgrounds } = useBackgrounds()
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
      class="-mb-2 flex h-8 items-center justify-between select-none"
      @pointerdown.stop
    >
      <div class="pointer-events-none px-2">
        <img src="/favicon.svg" class="size-5 grayscale" />
      </div>
      <div v-if="appWindow" class="z-377 [&>button]:pointer-events-auto [&>button]:rounded-none">
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
      class="bg-background relative z-0 flex min-h-0 flex-1 flex-col overflow-hidden border-2"
      :class="[isFullscreen ? 'p-6' : 'm-2 rounded-lg p-4']"
    >
      <div class="absolute inset-0 -z-10">
        <Image
          :src="
            backgrounds.find((b) => b.id === user?.backgroundId)?.url ||
            (showSkeleton
              ? '/images/backgrounds/02-rooftop-garden.png' /* TODO: Replace default background with an 'intro' one */
              : '')
          "
          class="pointer-events-none -z-10 size-full object-cover select-none"
        />
      </div>
      <slot />
    </section>
  </main>
</template>
