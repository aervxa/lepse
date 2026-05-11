<script setup lang="ts">
import { formatDate, formatTimeAgo, useDebounceFn, useLocalStorage } from '@vueuse/core'
import { Angry, Annoyed, Frown, History, Laugh, Plus, Save, Smile } from 'lucide-vue-next'
import { getClientDate } from '~/lib/utils'

definePageMeta({
  layout: 'app',
})

const route = useRoute()

const tab = ref<'journal' | 'scribbles'>(route.path.includes('scribbles') ? 'scribbles' : 'journal')

// ─── Journal ────────────────────────────────────────────────────────────────

const MOODS = [
  { value: 1, icon: Angry },
  { value: 2, icon: Frown },
  { value: 3, icon: Annoyed },
  { value: 4, icon: Smile },
  { value: 5, icon: Laugh },
]

const today = getClientDate()
const { journal, fetchJournal, updateJournal } = useDay(today)
const { journals } = useJournal()

const pastJournals = computed(() => {
  return journals.value
    .filter((j) => !j.date?.startsWith(today))
    .toSorted((a, b) => (b.date || '').localeCompare(a.date || ''))
})

const loading = ref(true)
const draft = useLocalStorage('journal_draft', '')
const body = ref(draft.value ?? '')
const mood = ref<number | null>(null)
const dirty = computed(
  () => body.value !== (journal.value?.body ?? '') || mood.value !== journal.value?.mood
)
const saving = ref(false)

const saveJournal = () => {
  saving.value = true
  updateJournal({ body: body.value, mood: mood.value }).then(() => {
    draft.value = ''
    saving.value = false
  })
}

onMounted(async () => {
  await fetchJournal()
  loading.value = false
  // Update body only if there's no draft (more inportant) and journal body exists
  if (!draft.value && journal.value?.body) body.value = journal.value.body
  if (journal.value?.mood) mood.value = journal.value.mood
})
watch(
  body,
  useDebounceFn((val) => {
    if (dirty.value) draft.value = val
    else draft.value = ''
  }, 500)
)

// ─── Scribbles ──────────────────────────────────────────────────────────────

const { scribbles } = useScribbles()

const sortedScribbles = computed(() =>
  scribbles.value.toSorted((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
)
</script>

<template>
  <div
    v-if="route.meta.nested !== false"
    class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 overflow-auto p-8"
  >
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-3xl font-bold">Journal</p>
        <p class="text-muted-foreground">Reflect on your day, capture your thoughts.</p>
      </div>
      <Button v-if="tab === 'scribbles'" as-child>
        <NuxtLink to="/app/journal/scribbles/create">
          <Plus />
          New Scribble
        </NuxtLink>
      </Button>
    </div>

    <Tabs
      v-model="tab"
      @update:model-value="
        (tab) =>
          tab === 'journal' ? navigateTo('/app/journal') : navigateTo('/app/journal/scribbles')
      "
      class="gap-8"
    >
      <TabsList>
        <TabsTrigger value="journal">Journal</TabsTrigger>
        <TabsTrigger value="scribbles">Scribbles</TabsTrigger>
      </TabsList>

      <!-- Journal -->
      <TabsContent value="journal">
        <div class="flex max-lg:flex-col gap-10">
          <!-- Today's Entry -->
          <div class="flex-1 flex flex-col gap-4">
            <p class="text-lg font-semibold">Today's Entry</p>

            <div class="relative min-h-96 flex">
              <Skeleton v-if="loading" class="flex-1" />
              <Textarea
                v-else
                v-model="body"
                placeholder="What's on your mind today?"
                class="flex-1 p-4"
                :class="[body.length && 'pb-16']"
              ></Textarea>
              <!-- Actions -->
              <div class="absolute bottom-4 left-4 right-4 flex justify-between">
                <div class="flex gap-1.">
                  <Button
                    v-for="m in MOODS"
                    :key="m.value"
                    :variant="mood === m.value ? 'secondary' : 'ghost'"
                    size="icon-sm"
                    @click="mood === m.value ? (mood = null) : (mood = m.value)"
                  >
                    <component :is="m.icon" :class="mood === m.value && 'text-green-400'" />
                  </Button>
                </div>
                <Button
                  v-if="dirty || body.length"
                  size="sm"
                  @click="saveJournal"
                  :disabled="saving || !dirty"
                >
                  <Save />
                  {{ dirty ? 'Save' : 'Saved' }}
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
              <Empty v-if="pastJournals.length === 0" class="border border-dashed">
                <EmptyDescription class="text-xs">No past entries found.</EmptyDescription>
              </Empty>

              <NuxtLink
                v-else
                v-for="journal in pastJournals"
                :to="`/app/journal/${getClientDate(journal.date)}`"
                :key="journal.id"
                class="contents"
              >
                <Item :variant="journal.body ? 'muted' : 'outline'">
                  <ItemContent>
                    <ItemTitle>
                      {{ formatDate(new Date(journal.date || ''), 'MMMM D, YYYY') }}
                    </ItemTitle>
                    <ItemDescription
                      class="line-clamp-2 whitespace-pre-wrap"
                      :class="[!journal.body && 'opacity-60']"
                    >
                      {{ journal.body ?? 'Empty' }}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </NuxtLink>
            </div>
          </div>
        </div>
      </TabsContent>

      <!-- Scribbles -->
      <TabsContent value="scribbles">
        <div class="flex max-lg:flex-col gap-10">
          <!-- Scribbles -->
          <div class="flex-1 flex flex-col gap-4">
            <p class="text-lg font-semibold">Scribbles</p>

            <div class="flex flex-col gap-3 max-w-lg">
              <Empty v-if="sortedScribbles.length === 0" class="border border-dashed">
                <EmptyHeader>
                  <EmptyTitle>No scribbles yet</EmptyTitle>
                  <EmptyDescription>
                    Start a note whenever you need to catch a passing thought.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>

              <NuxtLink
                v-else
                v-for="scribble in sortedScribbles"
                :key="scribble.id"
                :to="`/app/journal/scribbles/${scribble.id}`"
                class="contents"
              >
                <Item :variant="scribble.body ? 'muted' : 'outline'">
                  <ItemContent>
                    <ItemTitle>{{ scribble.title || 'Untitled' }}</ItemTitle>
                    <ItemDescription
                      class="line-clamp-2 whitespace-pre-wrap"
                      :class="[!scribble.body && 'opacity-60']"
                    >
                      {{ scribble.body || 'Empty' }}
                    </ItemDescription>
                  </ItemContent>
                  <ItemFooter>
                    <p class="text-xs text-muted-foreground/80">
                      Last updated {{ formatTimeAgo(new Date(scribble.updatedAt || '')) }}
                    </p>
                  </ItemFooter>
                </Item>
              </NuxtLink>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </div>

  <NuxtPage />
</template>
