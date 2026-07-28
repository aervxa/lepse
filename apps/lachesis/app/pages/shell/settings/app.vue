<script setup lang="ts">
import { isTauri } from '@tauri-apps/api/core'

definePageMeta({
  validate: isTauri,
})

const settingGroups = {
  general: [
    {
      key: 'windowTransparency' as const,
      title: 'Enable window transparency',
      description: "If your OS doesn't have a blur effect, this will look off.",
    },
    {
      key: 'minimizeToTray' as const,
      title: 'Minimize to tray',
      description: 'Closing (clicking X) will minimize to tray instead of fully exiting the app',
    },
  ],
}

const { windowTransparency, minimizeToTray } = useSettings()
</script>

<template>
  <div class="flex flex-col">
    <template v-for="[group, settings] in Object.entries(settingGroups)">
      <p class="mb-2 font-mono text-[10px] font-medium tracking-widest uppercase opacity-80">
        {{ group }}
      </p>
      <Item v-for="setting in settings" size="xs" class="px-0">
        <ItemContent>
          <ItemTitle>{{ setting.title }}</ItemTitle>
          <ItemDescription v-if="setting.description" class="text-xs">
            {{ setting.description }}
          </ItemDescription>
        </ItemContent>
        <ItemActions class="self-start">
          <Switch v-if="setting.key === 'windowTransparency'" v-model="windowTransparency" />
          <Switch v-if="setting.key === 'minimizeToTray'" v-model="minimizeToTray" />
        </ItemActions>
      </Item>
    </template>
  </div>
</template>
