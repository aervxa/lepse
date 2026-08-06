<script setup lang="ts">
import { isTauri } from '@tauri-apps/api/core'

definePageMeta({
  validate: isTauri,
})

const groups = {
  general: [
    {
      key: 'windowTransparency' as const,
      title: 'Enable window transparency',
      description: "If your OS doesn't have a blur effect, this will look off.",
    },
    {
      key: 'nativeDecorations' as const,
      title: 'Native decorations',
      description: 'Use system frame/titlebar (restart required).',
    },
    {
      key: 'minimizeToTray' as const,
      title: 'Minimize to tray',
      description: 'Closing (clicking X) will minimize to tray instead of fully exiting the app.',
    },
  ],
}

const { windowTransparency, nativeDecorations, minimizeToTray } = useSettings()
</script>

<template>
  <SettingsPrimitive :groups v-slot="{ setting }">
    <Switch v-if="setting.key === 'windowTransparency'" v-model="windowTransparency" />
    <Switch v-if="setting.key === 'nativeDecorations'" v-model="nativeDecorations" />
    <Switch v-if="setting.key === 'minimizeToTray'" v-model="minimizeToTray" />
  </SettingsPrimitive>
</template>
