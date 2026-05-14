<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import { getClientDate } from '~/lib/utils'

definePageMeta({
  layout: 'app',
  validate: (route) => route.params.date === getClientDate(route.params.date as string),
})

const route = useRoute()
const { journals } = useJournals()
const journal = computed(() =>
  journals.value.find((j) => j.date?.startsWith(route.params.date as string))
)
</script>

<template>
  <Dialog :open="true" @update:open="useRouter().back()">
    <DialogContent class="sm:max-w-xl max-h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle class="text-lg">
          {{ formatDate(new Date(route.params.date as string), 'dddd, MMMM D, YYYY') }}
        </DialogTitle>
        <DialogDescription>View and manage your journal of this day.</DialogDescription>
      </DialogHeader>

      <div class="flex min-h-48">
        <div v-if="journal?.body" class="text-base leading-relaxed whitespace-pre-wrap">
          {{ journal.body }}
        </div>
        <Empty v-else class="border border-dashed">
          <EmptyHeader>
            <EmptyTitle>No entry found</EmptyTitle>
            <EmptyDescription>
              You didn't write anything in your journal on this day.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </DialogContent>
  </Dialog>
</template>
