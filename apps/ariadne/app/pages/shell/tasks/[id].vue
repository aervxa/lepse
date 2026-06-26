<script setup lang="ts">
import { formatDate, useDebounceFn } from '@vueuse/core'
import { ChevronLeft, Clock, ClockFading, LoaderCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { formatDuration } from '~/lib/time'

definePageMeta({
  validate: (route) => !isNaN(Number(route.params.id)),
})

const route = useRoute()
const { id } = route.params
const source = inject(bubbleNavSourceKey)

const { tasks, updateTask } = useTasks()
const nameDraft = ref('')
const descriptionDraft = ref('')
const task = computed(() => {
  const t = tasks.value.find((t) => t.id === Number(id))
  nameDraft.value = t?.name ?? ''
  descriptionDraft.value = t?.description ?? ''
  return t
})
const isSaving = ref(false)

const save = async () => {
  // Get drafts only if they differ
  const name = nameDraft.value === task.value?.name ? undefined : nameDraft.value
  const description =
    descriptionDraft.value === task.value?.description ? undefined : descriptionDraft.value

  // if no differs, return
  if (name === undefined && description === undefined) return

  // skeletonLoad loading indicator to avoid flash
  skeletonLoad(
    (async () => {
      const error = await updateTask(Number(id), { name, description })
      if (error) toast.error('Failed to save task.')
    })(),
    isSaving
  )
}

const now = new Date()
const date = computed(() => new Date(task.value?.createdAt ?? 0))
const formattedDate = computed(() =>
  formatDate(
    date.value,
    now.getFullYear() - date.value.getFullYear() > 0 ? 'MMM D, YYYYY' : 'MMM D'
  )
)
</script>

<template>
  <Button
    variant="link"
    size="sm"
    class="my-2 w-fit opacity-60"
    :class="[source === 'drawer' && 'mb-0']"
    @click="navigateBack()"
  >
    <ChevronLeft />
    Go back
  </Button>

  <div
    v-if="task"
    class="flex flex-1 flex-col gap-4 p-4"
    :class="[source === 'drawer' ? 'pt-1' : 'pt-0']"
  >
    <!-- Header -->
    <div class="flex flex-col gap-1">
      <Input v-model="nameDraft" class="text-2xl font-medium" @blur="save" unstyled />

      <!-- Goal linking -->
      <div class="flex items-center">
        <p class="text-xs font-light opacity-80">Linked to</p>
        <TaskGoalLink :id="task.id" />
      </div>
      <!-- Time spent on task -->
      <div class="flex items-center gap-2">
        <div
          v-for="item in [
            { icon: ClockFading, label: `${task.pomoCount} pomos` },
            {
              icon: Clock,
              label: `${formatDuration(task.stopwatchMs, {
                format: task.stopwatchMs >= 3_600_000 /* an hour */ ? 'hhh mmm' : 'mmm',
                pad: false,
              })}`,
            },
          ]"
          class="flex items-center gap-1 sm:gap-1.5"
        >
          <component :is="item.icon" class="size-3 opacity-60" />
          <p class="text-[10px] leading-none font-extralight tracking-wide opacity-60">
            {{ item.label }}
          </p>
        </div>
      </div>
    </div>
    <Input
      v-model="descriptionDraft"
      class="text-base leading-relaxed font-light"
      placeholder="No description provided."
      @blur="save"
      unstyled
    />

    <Separator class="mt-auto opacity-50" />
    <div class="flex items-end justify-between gap-4">
      <div class="flex flex-col gap-1.5">
        <!-- STATUS -->
        <div class="flex items-center gap-2">
          <p class="font-mono text-[10px] font-medium tracking-widest uppercase opacity-80">
            Status:
          </p>
          <TaskStatusDropdown :id="task.id" :status="task.status">
            <Button variant="outline" size="xs">
              <TaskStatusIcon :status="task.status" />
              {{ task.status }}
            </Button>
          </TaskStatusDropdown>
        </div>
        <!-- PRIORITY -->
        <div class="flex items-center gap-2">
          <p class="font-mono text-[10px] font-medium tracking-widest uppercase opacity-80">
            Priority:
          </p>
          <TaskPriorityDropdown :id="task.id" :priority="task.priority">
            <Button variant="outline" size="xs">
              <TaskPriorityIcon :priority="task.priority" />
              {{ task.priority }}
            </Button>
          </TaskPriorityDropdown>
        </div>
        <!-- CREATED AT -->
        <p class="text-muted-foreground mt-1 text-xs">Created at {{ formattedDate }}</p>
      </div>
      <LoaderCircle v-if="isSaving" class="text-muted-foreground animate-spin" />
    </div>
  </div>
</template>
