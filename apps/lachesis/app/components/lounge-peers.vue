<script setup lang="ts">
const props = defineProps<{ peers: LoungePeers }>()

watch(
  () => props.peers,
  () => {
    console.log('peer-lounge', props.peers)
  }
)
</script>

<template>
  <!-- TODO: Handle better case when more peers exist (like opening a small dialog to view everyone) -->
  <div
    class="group/lounge-peers absolute top-1/2 flex -translate-y-1/2 flex-col gap-2 pe-4 max-sm:left-0 sm:right-0 lg:max-w-64"
  >
    <div v-for="p in peers" class="flex items-center-safe justify-end gap-3">
      <p
        class="truncate opacity-60 transition-opacity group-hover/lounge-peers:opacity-80 max-lg:hidden"
      >
        {{ p.user.name }}
      </p>
      <Avatar>
        <AvatarImage :src="p.user.avatarUrl ?? ''" />
        <AvatarFallback :delay-ms="SKELETON_DELAY_MS">
          {{ p.user.initials ?? 'X' }}
        </AvatarFallback>
      </Avatar>
    </div>
  </div>
</template>
