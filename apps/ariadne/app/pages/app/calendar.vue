<script setup lang="ts">
definePageMeta({
  layout: 'app',
})

import {
  CalendarCell,
  CalendarCellTrigger,
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
import type { DateValue } from '@internationalized/date'
import { fromDate, getLocalTimeZone } from '@internationalized/date'
import { ChevronLeft, ChevronRight, Clock, ClockFading } from 'lucide-vue-next'
import { getClientDate } from '~/lib/utils'
import { formatDuration } from '~/lib/time'

const date = ref(fromDate(new Date(), getLocalTimeZone())) as Ref<DateValue>
const { focusSessions, fetchFocusSessions } = useFocusSessions()
const calendarFetchedRanges = useState<{ date: string; frequency: 'monthly' }[]>(
  'calendarFetchedRanges',
  () => []
)

const getDate = (year: number, month: number, day: number) =>
  getClientDate(new Date(year, month - 1, day))

watch(
  () => [date.value.year, date.value.month],
  () => {
    const monthDate = getDate(date.value.year, date.value.month, 1)

    if (
      !calendarFetchedRanges.value.some(
        ({ date: d, frequency: f }) => d === monthDate && f === 'monthly'
      )
    ) {
      fetchFocusSessions(monthDate, 'monthly')

      calendarFetchedRanges.value.push({ date: monthDate, frequency: 'monthly' })
    }
  },
  { immediate: true }
)
</script>

<template>
  <Card class="max-w-3xl self-center my-auto py-0">
    <CalendarRoot
      v-slot="{ weekDays, grid, date }"
      v-model:placeholder="date"
      class="flex flex-col"
      weekdayFormat="long"
    >
      <CalendarHeader class="flex justify-between items-center border-b px-4 py-3">
        <CalendarPrev as-child>
          <Button variant="ghost" size="icon">
            <ChevronLeft />
          </Button>
        </CalendarPrev>
        <CalendarHeading class="text-xl font-medium tracking-wide" />
        <CalendarNext as-child>
          <Button variant="ghost" size="icon">
            <ChevronRight />
          </Button>
        </CalendarNext>
      </CalendarHeader>
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        class="w-full flex flex-col gap-2 p-4 pt-3"
      >
        <CalendarGridHead>
          <CalendarGridRow class="grid grid-cols-7 gap-2">
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="text-xs font-light tracking-wider text-muted-foreground text-start px-2"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody class="flex flex-col gap-3">
          <CalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="grid grid-cols-7 gap-3"
          >
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              class="text-center has-data-outside-view:opacity-30 has-data-outside-view:grayscale"
            >
              <CalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                v-slot="{ dayValue }"
                as-child
              >
                <NuxtLink
                  :to="`/app/calendar/${getDate(weekDate.year, weekDate.month, weekDate.day)}`"
                  class="relative flex flex-col gap-4 p-3 rounded-lg border border-border bg-card/50 data-today:bg-primary/25 data-today:border-primary/50 not-data-today:opacity-80"
                >
                  <p class="text-xl leading-none font-medium">
                    {{ dayValue }}
                  </p>
                  <div
                    class="flex flex-col gap-1"
                    v-for="fs in [
                      focusSessions.find((fs) =>
                        fs.date?.startsWith(getDate(weekDate.year, weekDate.month, weekDate.day))
                      ),
                    ]"
                  >
                    <div class="flex items-center gap-1.5" title="time worked">
                      <Clock class="size-3" />
                      <p class="text-xs">
                        {{
                          formatDuration(fs?.stopwatchMs ?? 0, {
                            format:
                              (fs?.stopwatchMs ?? 0) > 3_600_000 /* Above an hour */
                                ? 'hhh mmm'
                                : 'mmm',
                            pad: false,
                          })
                        }}
                      </p>
                    </div>
                    <div class="flex items-center gap-1.5" title="pomos completed">
                      <ClockFading class="size-3" />
                      <p class="text-xs">{{ fs?.pomoCount ?? 0 }} pomos</p>
                    </div>
                  </div>
                </NuxtLink>
              </CalendarCellTrigger>
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </CalendarRoot>
  </Card>

  <NuxtPage />
</template>
