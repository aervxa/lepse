<script setup lang="ts">
import { CalendarDays, ChevronUp, Target } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { Data } from '@lepse/minos/data'
import { Item } from '@/components/ui/item' // Manual import not needed for functionality, but zed(ide) mistakes Item usage for habit/item.vue lol

const props = defineProps<{
  habit: Data.Habit
}>()

const { habitPeriod, fetchHabitPeriod, incrementHabit } = useHabit(props.habit.id)

onMounted(() => {
  if (!habitPeriod.value) fetchHabitPeriod()
})

const isLoggingCount = ref(false)
const logCount = async () => {
  isLoggingCount.value = true
  const error = await incrementHabit()
  isLoggingCount.value = false
  if (error) toast.error('Failed to update habit count.')
}
</script>

<template>
  <Item variant="outline" as-child>
    <NuxtLink :to="`/app/habits/${habit.id}`">
      <ItemContent>
        <ItemTitle>{{ habit.name }}</ItemTitle>
        <ItemDescription class="flex items-center gap-3">
          <span class="flex items-center gap-1">
            <CalendarDays class="size-3" />
            <span class="capitalize">{{ habit.frequency }}</span>
          </span>
          <span class="flex items-center gap-1">
            <Target class="size-3" />
            {{ habitPeriod ? `${habitPeriod.count} / ${habit.target}` : `0 / ${habit.target}` }}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions @click.stop>
        <Button
          size="sm"
          :variant="habitPeriod?.completed ? 'default' : 'outline'"
          :disabled="isLoggingCount"
          @click.prevent="logCount()"
        >
          <ChevronUp v-if="!habitPeriod?.completed" />
          {{ habitPeriod?.completed ? 'Done' : 'Log' }}
        </Button>
      </ItemActions>
    </NuxtLink>
  </Item>
</template>
