<script setup lang="ts">
const rawGroups = {
  general: [
    {
      key: 'theme' as const,
      title: 'Theme',
      description: 'Select your preferred color.',
    },
    {
      key: 'themeOptions' as const,
      title: 'Theme options',
      description: 'Control which texts are accented.',
    },
  ],
  background: [
    {
      key: 'blurBackground' as const,
      title: 'Blur background',
      description: 'Some backgrounds may be too distracting under text.',
    },
    {
      key: 'darkenBackground' as const,
      title: 'Darken background',
      description: 'Some background may be too bright.',
    },
  ],
} as const
type SettingItem = (typeof rawGroups)[keyof typeof rawGroups][number]
const groups: Record<string, readonly SettingItem[]> = rawGroups

const {
  THEMES,
  theme,
  THEME_OPTIONS,
  THEME_OPTION_LABELS,
  themeOptions,
  blurBackground,
  darkenBackground,
} = useSettings()
</script>

<template>
  <SettingsPrimitive :groups v-slot="{ setting }">
    <Select v-if="setting.key === 'theme'" v-model="theme">
      <SelectTrigger>
        <SelectValue class="capitalize" placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent position="popper" align="end" class="max-h-64">
        <SelectGroup>
          <SelectLabel>Colors</SelectLabel>
          <SelectItem v-for="t in THEMES" :value="t" class="capitalize">
            <div :data-theme="t" class="bg-foreground-fixed size-3 rounded-full"></div>
            {{ t }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <Select v-if="setting.key === 'themeOptions'" v-model="themeOptions">
      <SelectTrigger>
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent position="popper" align="end" class="max-h-64">
        <SelectGroup>
          <SelectItem v-for="to in THEME_OPTIONS" :value="to">
            {{ THEME_OPTION_LABELS[to] }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <Switch v-if="setting.key === 'blurBackground'" v-model="blurBackground" />
    <Switch v-if="setting.key === 'darkenBackground'" v-model="darkenBackground" />
  </SettingsPrimitive>
</template>
