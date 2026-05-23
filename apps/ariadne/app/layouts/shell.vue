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

// ─── App ────────────────────────────────────────────────────────────────────
import { isTauri } from '@tauri-apps/api/core'
import type { UnlistenFn } from '@tauri-apps/api/event'
import { getCurrentWebviewWindow, type WebviewWindow } from '@tauri-apps/api/webviewWindow'

const isApp = isTauri()
const isAppMaximized = ref(false)
let appWindow: WebviewWindow | undefined
let unlisten: UnlistenFn | undefined

onMounted(async () => {
  if (isApp) {
    appWindow = getCurrentWebviewWindow()
    isAppMaximized.value = await appWindow.isMaximized()

    unlisten = await appWindow?.onResized(async () => {
      isAppMaximized.value = (await appWindow?.isMaximized()) ?? false
    })
  }
})

onUnmounted(() => {
  unlisten?.()
})
</script>

<template>
  <main class="flex h-dvh flex-col bg-sidebar">
    <div
      v-if="isApp"
      data-slot="titlebar"
      data-tauri-drag-region
      class="h-8 flex justify-between items-center -mb-2 select-none"
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
      <div class="[&>button]:rounded-none">
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
          class="hover:[&>svg]:stroke-3 text-muted-foreground hover:text-destructive w-10 pr-2"
        >
          <X />
        </Button>
      </div>
    </div>

    <!-- Main App -->
    <section
      class="flex-1 min-h-0 m-2 rounded-lg bg-background overflow-hidden border-2 flex flex-col"
    >
      <slot />
    </section>
  </main>
</template>
