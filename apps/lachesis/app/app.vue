<script setup lang="ts">
const { theme } = useSettings()

onMounted(() => {
  watch(
    theme,
    () => {
      window.document.documentElement.dataset.theme = theme.value
    },
    { immediate: true }
  )
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster position="top-center" richColors />
  <DialogRenderer />
</template>
