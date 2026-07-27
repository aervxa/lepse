<script setup lang="ts">
const { user } = useAuth()
</script>

<template>
  <div
    v-if="!user?.emailVerified"
    class="absolute inset-0 z-50 grid place-content-center bg-black/80 backdrop-blur-xs"
  >
    <Empty>
      <EmptyHeader>
        <EmptyTitle> Please verify your email to access this page. </EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <slot />
      </EmptyContent>
    </Empty>
  </div>
</template>
