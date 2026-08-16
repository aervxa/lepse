<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  Clock,
  ClockFading,
  LoaderCircle,
  MoreHorizontal,
  Trash,
  Unlink,
} from '@lucide/vue'
import { toast } from 'vue-sonner'
import { formatDuration } from '~/lib/time'

definePageMeta({
  validate: (route) => !isNaN(Number(route.params.id)),
})

const route = useRoute()
const { id } = route.params
const source = inject(bubbleNavSourceKey)

const { tasks, updateTask, destroyTask } = useTasks()
const nameEl = useTemplateRef('nameEl')
const descriptionEl = useTemplateRef('descriptionEl')
const task = computed(() => {
  const t = tasks.value.find((t) => t.id === Number(id))
  if (t) {
    nameEl.value && (nameEl.value.textContent = t.name)
    descriptionEl.value && (descriptionEl.value.innerText = t.description ?? '')
  }
  return t
})
const isSaving = ref(false)

const clearEmptyInput = (event: InputEvent) => {
  const target = event.currentTarget as HTMLElement
  if (!target) return
  if (!target.textContent) target.textContent = null
}

const save = async () => {
  if (!task.value || !nameEl.value || !descriptionEl.value) return
  const name = nameEl.value.textContent
  const description = descriptionEl.value.innerText

  // if values are not dirty, there's nothing to change
  const nameDirty = name !== task.value.name
  const descriptionDirty = description !== task.value.description
  if (!nameDirty && !descriptionDirty) return

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

const { goals, createGoal } = useGoals()
const goal = computed(() => goals.value.find((g) => g.id === task.value?.goalId))

const linkGoal = async (goalId: number | null) => {
  if (task.value) {
    const error = await updateTask(task.value.id, { goalId })
    if (error) toast.error('Failed to link goal.')
    else toast.success(goalId === null ? 'Goal unlinked.' : 'Goal linked.')
  }
}

const createNewGoal = async (search: string) => {
  const error = await createGoal({ name: search })
  if (error) toast.error('Failed to create goal!', { description: error.message })
}

const deleteTask = async () => {
  const error = await destroyTask(Number(id))
  if (error) toast.error('Failed to delete task.', { description: error.message })
  else {
    toast.success('Task deleted successfully.')
    navigateBack()
  }
}
</script>

<template>
  <div class="flex items-center justify-between gap-4 p-2 pl-0">
    <Button
      variant="link"
      size="sm"
      class="w-fit opacity-60"
      :class="[source === 'drawer' && 'mb-0']"
      @click="navigateBack()"
    >
      <ChevronLeft />
      Go back
    </Button>

    <!-- More options -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-40" align="end">
        <DropdownMenuItem variant="destructive" @select="deleteTask">
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <div
    v-if="task"
    class="flex flex-1 flex-col gap-4 p-4"
    :class="[source === 'drawer' ? 'pt-1' : 'pt-0']"
  >
    <!-- Header -->
    <div class="flex flex-col gap-1">
      <p
        ref="nameEl"
        data-placeholder="required"
        class="before:text-destructive/50 no-scrollbar overflow-x-auto text-2xl font-medium whitespace-nowrap outline-none before:pointer-events-none before:text-xl before:font-light before:italic empty:before:content-[attr(data-placeholder)]"
        @keydown.enter.prevent
        @input="clearEmptyInput"
        @blur="save"
        contenteditable
      ></p>

      <!-- Goal linking -->
      <div class="flex items-center">
        <p class="text-xs font-light opacity-80">Linked to</p>
        <ContextMenu v-if="goal">
          <ContextMenuTrigger as-child>
            <Button variant="ghost" size="xs" as-child>
              <NuxtLink :to="`/goals/${goal.id}`">
                <Link />
                {{ goal.name }}
              </NuxtLink>
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem as-child>
              <NuxtLink :to="`/goals/${goal.id}`">
                <ArrowUpRight />
                Open goal
              </NuxtLink>
            </ContextMenuItem>
            <ContextMenuItem @select="linkGoal(null)">
              <Unlink />
              Unlink
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <Combobox
          v-else
          :items="goals"
          @select="
            (item) => {
              linkGoal(item.id)
            }
          "
          :create="createNewGoal"
          empty="No goals found."
          placeholder="Search a goal"
        >
          <Button variant="ghost" size="xs">
            <Link />
            <span class="text-muted-foreground italic">none</span>
          </Button>
        </Combobox>
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
    <!-- Description | relative/absolute wrapper to force contenteditable p tag into a fixed space (otherwise grows parent) -->
    <div class="relative flex-1">
      <div class="absolute inset-0">
        <ScrollArea class="size-full">
          <p
            ref="descriptionEl"
            data-placeholder="No description provided."
            class="before:text-muted-foreground text-base font-light outline-none before:pointer-events-none before:italic empty:before:content-[attr(data-placeholder)]"
            @input="clearEmptyInput"
            @blur="save"
            contenteditable
          ></p>
        </ScrollArea>
      </div>
    </div>

    <Separator class="opacity-50" />
    <div class="flex items-end justify-between gap-4">
      <div class="flex flex-col gap-1.5">
        <!-- STATUS -->
        <div class="flex items-center gap-2">
          <p class="font-mono text-[10px] font-medium tracking-widest uppercase opacity-80">
            Status:
          </p>
          <TaskStatusDropdown :id="task.id" :status="task.status" align="end" side="right">
            <Button variant="outline" size="xs">
              <TaskStatusIcon :status="task.status" />
              {{ task.status }}
              <ChevronDown />
            </Button>
          </TaskStatusDropdown>
        </div>
        <!-- PRIORITY -->
        <div class="flex items-center gap-2">
          <p class="font-mono text-[10px] font-medium tracking-widest uppercase opacity-80">
            Priority:
          </p>
          <TaskPriorityDropdown :id="task.id" :priority="task.priority" align="end" side="right">
            <Button variant="outline" size="xs">
              <TaskPriorityIcon :priority="task.priority" />
              {{ task.priority }}
              <ChevronDown />
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
