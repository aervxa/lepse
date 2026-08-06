<script setup lang="ts">
definePageMeta({
  validate: () => useAuth().user.value !== undefined,
  redirect: () => '/settings/account',
})
</script>

<template>
  <NuxtPage />
</template>
