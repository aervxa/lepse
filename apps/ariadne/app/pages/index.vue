<script setup lang="ts">
const { user } = useAuth()
</script>

<template>
  <p>yokoso, {{ user?.fullName || user?.email.split('@')[0] }}</p>
</template>
