<script setup lang="ts">
const { user } = useAuth()
</script>

<template>
  <p>yokoso, {{ user?.name || user?.email.split('@')[0] }}</p>
</template>
