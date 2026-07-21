<script setup lang="ts">
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from 'reka-ui'
import { fromDate, getLocalTimeZone, type DateValue } from '@internationalized/date'
import { ChevronLeft, ChevronRight, Clock, ClockFading } from 'lucide-vue-next'
import { formatDate } from '@vueuse/core'
import { formatDuration } from '~/lib/time'

definePageMeta({
  layout: 'app',
})

const date = ref(fromDate(new Date(), getLocalTimeZone())) as Ref<DateValue>

// store dates of months that have been fetched
const cachedMonths = useState<string[]>('cachedMonths', () => [])

const { focusSessions, fetchFocusSessions } = useFocusSessions()

// fetch month data when date.month changes
watch(
  () => [date.value.month],
  () => {
    const month = getClientDate(date.value.toDate(getLocalTimeZone()))
    if (!cachedMonths.value.some((m) => m === month)) {
      fetchFocusSessions(month, 'monthly')
      cachedMonths.value.push(month)
    }
  },
  { immediate: true }
)
</script>

<template>
  <AppPage class="max-w-6xl">
    <CalendarRoot
      v-model:placeholder="date"
      v-slot="{ weekDays, grid, date }"
      class="flex min-h-0 flex-1 flex-col gap-4"
      weekdayFormat="long"
    >
      <CalendarHeader class="flex items-center justify-between">
        <CalendarHeading class="text-3xl leading-normal font-bold" />
        <div>
          <CalendarPrev as-child>
            <Button variant="ghost" size="icon" aria-label="Previous month">
              <ChevronLeft />
            </Button>
          </CalendarPrev>
          <CalendarNext as-child>
            <Button variant="ghost" size="icon" aria-label="Next month">
              <ChevronRight />
            </Button>
          </CalendarNext>
        </div>
      </CalendarHeader>

      <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="flex flex-col gap-2">
        <CalendarGridHead>
          <CalendarGridRow class="grid grid-cols-7">
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="text-muted-foreground py-1 text-xs font-medium"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>

        <CalendarGridBody>
          <Card class="py-0">
            <CardContent class="px-0">
              <CalendarGridRow
                v-for="row in month.rows"
                class="group/calendar-grid-row grid grid-cols-7"
              >
                <CalendarCell
                  v-for="cell in row"
                  :key="cell.day"
                  :date="cell"
                  class="hover:bg-accent/20 border-e border-b bg-clip-padding group-last/calendar-grid-row:border-b-0 last:border-e-0"
                  :class="[
                    cell.compare(date) === 0 && 'bg-primary/20 hover:bg-primary/25',
                    cell.month !== month.value.month && '**:opacity-60',
                  ]"
                  @click="(console.log(cell), console.log(date))"
                >
                  <NuxtLink
                    :to="`/app/calendar/${getClientDate(cell.toDate(getLocalTimeZone()))}`"
                    class="flex min-h-24 flex-col gap-4 p-2 pt-1.5"
                  >
                    <!-- Cell "header" -->
                    <div
                      class="flex gap-[1ch] self-end text-xs leading-none"
                      :class="[
                        cell.month === month.value.month
                          ? 'text-muted-foreground font-medium'
                          : 'text-muted-foreground/40 font-extralight',
                      ]"
                    >
                      <!-- Show month on the first day, only if prevous month days exist -->
                      <p
                        v-if="cell.month === month.value.month && cell.day === 1 && row[0] !== cell"
                      >
                        {{ formatDate(cell.toDate(getLocalTimeZone()), 'MMM') }}
                      </p>
                      <p>{{ cell.day }}</p>
                    </div>

                    <!-- Focus session -->
                    <div
                      v-for="fs in [
                        focusSessions.find((fs) =>
                          fs.date?.startsWith(getClientDate(cell.toDate(getLocalTimeZone())))
                        ),
                      ]"
                      class="text-muted-foreground mt-auto flex gap-2 text-[10px]"
                    >
                      <div class="flex min-w-0 items-center gap-1" title="time worked">
                        <Clock class="size-2.5 flex-none" />
                        <p class="truncate">
                          {{
                            formatDuration(fs?.stopwatchMs ?? 0, {
                              format: (fs?.stopwatchMs ?? 0) > 3_600_000 ? 'hhh mmm' : 'mmm',
                              pad: false,
                            })
                          }}
                        </p>
                      </div>
                      <div class="flex min-w-0 items-center gap-1" title="pomos completed">
                        <ClockFading class="size-2.5 flex-none" />
                        <p class="truncate">{{ fs?.pomoCount ?? 0 }} pomos</p>
                      </div>
                    </div>
                  </NuxtLink>
                </CalendarCell>
              </CalendarGridRow>
            </CardContent>
          </Card>
        </CalendarGridBody>
      </CalendarGrid>
    </CalendarRoot>
  </AppPage>
</template>
