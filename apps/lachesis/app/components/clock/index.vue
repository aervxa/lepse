<script setup lang="ts">
const { user } = useAuth()
const now = useSharedNow()
const nowStr = computed(() => now.value.toLocaleTimeString([], { timeStyle: 'short' }))
const { activeGreeting } = useGreeting()
</script>

<template>
  <ClockWrapper>
    <!-- Greeting -->
    <div class="flex flex-col items-center">
      <p
        class="fixed-color-clock:text-foreground text-foreground-fixed max-w-xs text-center text-base font-medium text-balance sm:max-w-sm sm:text-lg md:text-xl 2xl:text-2xl"
      >
        {{ activeGreeting.replace('{name}', user?.name ?? 'wraith') }}
      </p>
    </div>

    <ClockTime :value="nowStr.slice(0, -3)" :sub="nowStr.slice(-2)" />
  </ClockWrapper>
</template>
