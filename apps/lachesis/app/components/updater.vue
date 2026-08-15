<script setup lang="ts">
import { check, type Update } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { Download, Loader2 } from '@lucide/vue'
import { platform } from '@tauri-apps/plugin-os'
import { toast } from 'vue-sonner'

const isUpdatable = ref(false)
let updateHandler: Update | null
const isAvailable = ref(false)
const downloaded = ref(0)
const contentLength = ref(0)
const hasStartedDownload = ref(false)

onMounted(async () => {
  const os = platform()
  isUpdatable.value = os === 'windows' || os === 'macos'
  if (!isUpdatable.value) return
  try {
    updateHandler = await check()
    updateHandler &&
      console.log(
        `[update] Found v${updateHandler.version} (current: v${updateHandler.currentVersion})`
      )
  } catch (e) {
    console.error('[update] finding updates failed', e)
    toast.error('Failed to check for updates!', {
      description: typeof e === 'string' ? e : undefined, // tauri throws string instead of Error
    })
  }
  isAvailable.value = !!updateHandler
})

const update = async () => {
  if (!updateHandler) return
  try {
    await updateHandler.downloadAndInstall((download) => {
      switch (download.event) {
        case 'Started':
          hasStartedDownload.value = true
          contentLength.value = download.data.contentLength ?? 0
          console.log(`[updating] started downloading of ${contentLength.value} bytes`)
          break
        case 'Progress':
          downloaded.value += download.data.chunkLength
          console.log(`[update] downloaded ${downloaded.value} from ${contentLength.value}`)
          break
        case 'Finished':
          console.log('[update] download finished')
          break
      }
    })
    console.log(`[update] upgraded to v${updateHandler.version}`)
    await relaunch()
  } catch (e) {
    console.error('[update] download and install failed', e)
    toast.error('Failed to install update!', {
      description: typeof e === 'string' ? e : undefined, // tauri throws string instead of Error
    })
    hasStartedDownload.value = false
  }
}
</script>

<template>
  <HoverCard v-if="isUpdatable && isAvailable">
    <HoverCardTrigger>
      <Button
        variant="ghost"
        size="icon-sm"
        tabindex="-1"
        class="text-primary relative"
        @click="update"
        :disabled="hasStartedDownload"
      >
        <Download />
        <Loader2
          v-if="hasStartedDownload"
          class="text-muted-foreground/40 absolute top-0 right-0 size-2 -translate-x-1/3 translate-y-1/3 animate-spin"
        />
      </Button>
    </HoverCardTrigger>
    <HoverCardContent align="end" class="flex flex-col gap-2">
      <p class="font-medium sm:text-lg">Downloading new update...</p>
      <Progress
        :model-value="downloaded && contentLength ? (downloaded / contentLength) * 100 : 0"
      />
    </HoverCardContent>
  </HoverCard>
</template>
