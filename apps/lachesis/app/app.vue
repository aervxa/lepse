<script setup lang="ts">
import { camelCase } from 'change-case'

const { theme, THEME_OPTIONS, themeOptions } = useSettings()

onMounted(() => {
  watch(
    theme,
    () => {
      window.document.documentElement.dataset.theme = theme.value
    },
    { immediate: true }
  )
  watch(
    themeOptions,
    () => {
      for (const to of THEME_OPTIONS) {
        if (themeOptions.value === to) {
          window.document.documentElement.dataset[camelCase(to.slice(5))] = ''
        } else {
          window.document.documentElement.removeAttribute(to)
        }
      }
    },
    { immediate: true }
  )
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster position="top-center" richColors class="font-[inherit]!" />
  <DialogRenderer />
</template>
