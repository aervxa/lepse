<script setup lang="ts">
import { formatDate, useDebounceFn, useLocalStorage } from '@vueuse/core'
import { History, Save } from 'lucide-vue-next'
import { getClientDate } from '~/lib/utils'

definePageMeta({
  layout: 'app',
})

const today = getClientDate()

const route = useRoute()
const { journal, fetchJournal, updateJournal } = useDay(today)
const { journals } = useJournal()

const pastJournals = computed(() => {
  return journals.value
    .filter((j) => !j.date?.startsWith(today))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
})

const loading = ref(true)
const draft = useLocalStorage('journal_draft', '')
const journalBody = ref(draft.value ?? '')
const journalBodyDirty = computed(() => journalBody.value !== journal.value?.body)
const saving = ref(false)

const saveJournal = () => {
  if (!journalBody.value) return
  saving.value = true
  updateJournal({ body: journalBody.value }).then(() => {
    draft.value = ''
    saving.value = false
  })
}

onMounted(async () => {
  await fetchJournal()
  loading.value = false
  // Update journalBody only if there's no draft (more inportant) and journal body exists
  if (!draft.value && journal.value?.body) journalBody.value = journal.value.body
})
watch(
  journalBody,
  useDebounceFn((val) => {
    if (journalBodyDirty.value) draft.value = val
    else draft.value = ''
  }, 500)
)
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

        <div class="relative min-h-96 flex">
          <Skeleton v-if="loading" class="flex-1" />
          <Textarea
            v-else
            v-model="journalBody"
            placeholder="What's on your mind today?"
            class="flex-1 p-4"
            :class="[journalBody.length && 'pb-16']"
          ></Textarea>
          <!-- Actions -->
          <div class="absolute bottom-4 right-4 flex items-end">
            <!-- TODO: Actions (markdown) -->
            <Button
              v-if="journalBody.length"
              size="sm"
              @click="saveJournal"
              :disabled="saving || !journalBodyDirty"
            >
              <Save />
              {{ journalBodyDirty ? 'Save' : 'Saved' }}
            </Button>
          </div>
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
