<script setup lang="ts">
const groups = {
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
}

const { THEMES, theme, THEME_OPTIONS, THEME_OPTION_LABELS, themeOptions } = useSettings()
</script>

<template>
  <EmailVerifiedOnly>
    <DialogClose as-child>
      <Button>Close</Button>
    </DialogClose>
  </EmailVerifiedOnly>

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
  </SettingsPrimitive>
</template>
