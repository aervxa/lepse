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
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const date = ref(fromDate(new Date(), getLocalTimeZone())) as Ref<DateValue>
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
                  :to="`/app/calendar/${weekDate.year}-${weekDate.month.toString().padStart(2, '0')}-${weekDate.day.toString().padStart(2, '0')}`"
                  class="flex flex-col gap-4 p-3 rounded-lg border border-border bg-card/50 data-today:bg-primary/25 data-today:border-primary/50 not-data-today:opacity-80"
                >
                  <p class="text-xl self-center leading-none font-medium">
                    {{ dayValue }}
                  </p>
                  <div class="flex justify-around items-end gap-4 -p-1">
                    <span class="size-3 shrink-0 border-2 rounded-full border-green-500"></span>
                    <p class="text-xs grayscale-50 self-end leading-none">
                      {{ ['😴', '😒', '🙂', '😄', '🤩'][Math.floor(Math.random() * 5)] }}
                    </p>
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
