<script setup lang="ts">
import { computed } from 'vue'
import { CalendarIcon } from 'lucide-vue-next'
import {
  getLocalTimeZone,
  today,
  parseAbsoluteToLocal,
  parseDate,
  DateFormatter,
} from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const props = withDefaults(defineProps<{ id?: string; placeholder?: string }>(), {
  placeholder: 'Pick a date',
})

/*
 * Model is the source of truth for the date value (in string)
 * computed is for havign different types for output and input
 */
const model = defineModel<string | undefined>()
const date = computed<DateValue | undefined>({
  get: () =>
    model.value
      ? // Handle both full ISO and simple date strings
        model.value.includes('T')
        ? parseAbsoluteToLocal(model.value)
        : parseDate(model.value)
      : undefined,
  set: (val: DateValue | undefined) => {
    // Update model with string value
    model.value = val?.toString()
  },
})

const df = new DateFormatter('en-US', { dateStyle: 'long' })
const label = computed(() =>
  date.value ? df.format(date.value.toDate(getLocalTimeZone())) : props.placeholder
)
</script>

<template>
  <Popover v-slot="{ close }">
    <PopoverTrigger as-child>
      <slot name="trigger" :label="label">
        <Button
          :id
          variant="outline"
          :class="cn('justify-start text-left font-normal', !date && 'text-muted-foreground')"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{ label }}
        </Button>
      </slot>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar
        v-model="date"
        :default-placeholder="today(getLocalTimeZone())"
        layout="month-and-year"
        initial-focus
        @update:model-value="close"
      />
    </PopoverContent>
  </Popover>
</template>
