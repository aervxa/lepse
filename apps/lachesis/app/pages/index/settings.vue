<script setup lang="ts">
useRoute().path === '/settings' &&
  navigateTo(useAuth().user.value ? '/settings/account' : '/settings/appearance', {
    replace: true,
  })
</script>

<template>
  <NuxtPage />
</template>
