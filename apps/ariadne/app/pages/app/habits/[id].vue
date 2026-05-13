<script setup lang="ts">
import { CalendarDays, ChevronDown, ChevronUp, Pencil, Target } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

definePageMeta({
  nested: false,
})

const route = useRoute()
const { habits, habitPeriods, fetchHabitPeriod, incrementHabit, decrementHabit } = useHabits()

const habitId = computed(() => Number(route.params.id))
const habit = computed(() => habits.value.find((h) => h.id === habitId.value))
const habitPeriod = computed(() => habitPeriods.value.find((hp) => hp.habitId === habitId.value))

onMounted(() => {
  fetchHabitPeriod(habitId.value)
})

const isLoggingCount = ref(false)
const logCount = async () => {
  isLoggingCount.value = true
  const error = await incrementHabit(habitId.value)
  isLoggingCount.value = false
  if (error) toast.error('Failed to update habit count.')
}

const isUndoingCount = ref(false)
const undoCount = async () => {
  isUndoingCount.value = true
  const error = await decrementHabit(habitId.value)
  isUndoingCount.value = false
  if (error) toast.error('Failed to undo habit count.')
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 overflow-auto p-8">
    <template v-if="habit">
      <!-- Header -->
      <div class="flex flex-col gap-2">
        <div class="flex justify-between">
          <p class="text-3xl font-semibold">{{ habit.name }}</p>
          <div class="flex gap-2">
            <Button variant="outline" as-child>
              <NuxtLink :to="`/app/habits/${habit.id}/edit`">
                <Pencil />
                Edit
              </NuxtLink>
            </Button>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <!-- Meta -->
          <div
            class="flex items-center gap-3 ps-2 text-xs leading-none text-muted-foreground whitespace-nowrap"
          >
            <div class="flex items-center gap-1.5" title="frequency">
              <CalendarDays class="size-3" />
              <p class="capitalize">{{ habit.frequency }}</p>
            </div>
            <Separator orientation="vertical" />
            <div class="flex items-center gap-1.5" title="target">
              <Target class="size-3" />
              <p>
                {{ habitPeriod ? `${habitPeriod.count} / ${habit.target}` : `0 / ${habit.target}` }}
              </p>
            </div>
          </div>

          <!-- Status -->
          <div class="flex gap-2">
            <Badge v-if="habitPeriod" :variant="habitPeriod.completed ? 'default' : 'secondary'">
              {{ habitPeriod.completed ? 'Completed' : 'In progress' }}
            </Badge>
            <Badge v-else variant="secondary">Not started</Badge>
          </div>
        </div>
      </div>

      <!-- Description -->
      <p class="text-muted-foreground" :class="habit.description ? '' : 'italic'">
        {{ habit.description ?? 'No description provided.' }}
      </p>

      <!-- Controls -->
      <div class="flex items-center gap-2">
        <Button
          v-if="habitPeriod"
          variant="outline"
          size="sm"
          :disabled="isUndoingCount"
          @click="undoCount"
        >
          -1
        </Button>
        <Button size="sm" :disabled="isLoggingCount" @click="logCount"> +1 </Button>
      </div>
    </template>
  </div>

  <NuxtPage />
</template>
