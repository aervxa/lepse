<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'

const route = useRoute()
const { scribbles } = useScribbles()

const scribble = computed(() =>
  scribbles.value.find((entry) => entry.id === Number(route.params.id))
)
</script>

<template>
  <DialogHeader>
    <DialogTitle class="text-lg" :class="[!scribble?.title && 'italic']">
      {{ scribble?.title || 'Untitled' }}
    </DialogTitle>
    <DialogDescription>
      Last updated {{ formatTimeAgo(new Date(scribble?.updatedAt || '')) }}
    </DialogDescription>
  </DialogHeader>

  <div class="flex min-h-48">
    <div v-if="scribble?.body" class="leading-relaxed whitespace-pre-wrap">
      {{ scribble.body }}
    </div>
    <Empty v-else class="border">
      <EmptyHeader>
        <EmptyTitle>Nothing here &nbsp;:(</EmptyTitle>
        <EmptyDescription>This scribble only has a title right now.</EmptyDescription>
      </EmptyHeader>
      <Button variant="link" size="sm" as-child>
        <NuxtLink :to="`/app/journal/scribbles/${route.params.id}/edit`">Add content</NuxtLink>
      </Button>
    </Empty>
  </div>

  <DialogFooter>
    <Button variant="outline" @click="navigateTo('/app/journal/scribbles')">Close</Button>
    <Button as-child>
      <NuxtLink :to="`/app/journal/scribbles/${route.params.id}/edit`">Edit</NuxtLink>
    </Button>
  </DialogFooter>
</template>
