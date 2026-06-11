<script setup>
const { user } = useAuth()
</script>

<template>
  <Avatar>
    <!-- TODO: Put actual avatar -->
    <AvatarImage src="https://avatars.githubusercontent.com/u/122371060" />
    <AvatarFallback :delay-ms="SKELETON_DELAY_MS">{{ user.initials }}</AvatarFallback>
  </Avatar>
</template>
