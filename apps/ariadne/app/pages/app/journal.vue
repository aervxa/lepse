<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import { History } from 'lucide-vue-next'
import { getClientDate } from '~/lib/utils'

definePageMeta({
  layout: 'app',
})

const today = getClientDate()

const route = useRoute()
const { journal, fetchJournal } = useDay(today)
const { journals } = useJournal()

const pastJournals = computed(() => {
  return journals.value
    .filter((j) => !j.date?.startsWith(today))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
})

const loading = ref(true)
onMounted(async () => {
  await fetchJournal()
  loading.value = false
})

const journalBody = ref(journal.value?.body ?? '')
</script>

<template>
  <div
    v-if="route.meta.nested !== false"
    class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 overflow-auto p-8"
  >
    <!-- Header -->
    <div class="flex flex-col">
      <p class="text-3xl font-bold">Journal</p>
      <p class="text-muted-foreground">Reflect on your day, capture your thoughts.</p>
    </div>

    <div class="flex max-lg:flex-col gap-10">
      <!-- Today's Entry -->
      <div class="flex-1 flex flex-col gap-4">
        <p class="text-lg font-semibold">Today's Entry</p>

        <div class="min-h-96 flex">
          <Skeleton v-if="loading" class="flex-1" />
          <!-- TODO: Save drafts automatically -->
          <Textarea
            v-else
            v-model="journalBody"
            placeholder="What's on your mind today?"
            class="flex-1 p-4"
          ></Textarea>
          <!-- TODO: Action to save -->
        </div>
      </div>

      <!-- Past Entries -->
      <div class="lg:basis-64 xl:basis-80 flex flex-col gap-4">
        <div class="flex items-center gap-2 text-muted-foreground my-[5.5px]">
          <History class="size-4" />
          <p class="text-sm uppercase font-bold tracking-wider leading-none">History</p>
        </div>

        <div class="flex flex-col gap-3">
          <div v-if="loading" v-for="i in 4" :key="i">
            <Skeleton class="h-20 w-full rounded-xl" />
          </div>

          <Empty v-else-if="pastJournals.length === 0" class="border border-dashed">
            <EmptyDescription class="text-xs">No past entries found.</EmptyDescription>
          </Empty>

          <!-- TODO: Open in modal -->
          <Item
            v-else
            v-for="journal in pastJournals"
            :key="journal.id"
            :variant="journal.body === null ? 'outline' : 'muted'"
          >
            <ItemContent>
              <ItemTitle>{{ formatDate(new Date(journal.date || ''), 'MMMM D, YYYY') }}</ItemTitle>
              <ItemDescription
                class="line-clamp-2"
                :class="[journal.body === null && 'opacity-60']"
              >
                {{ journal.body ?? 'Empty' }}
              </ItemDescription>
            </ItemContent>
          </Item>
        </div>
      </div>
    </div>
  </div>

  <NuxtPage />
</template>
