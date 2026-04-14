<script setup lang="ts">
import {
  Plus,
  MoreVertical,
  Trash2,
  Edit2,
  Clock,
  Timer,
  Calendar,
  CheckCircle2,
  Circle,
  PlayCircle,
} from 'lucide-vue-next'
import { formatDate } from '@vueuse/core'
import { formatDuration } from '~/lib/time'
import { toast } from 'vue-sonner'

const { tasks, fetchTasks, destroyTask } = useTasks()

await fetchTasks()

// Delete confirmation state
const pendingDeleteId = ref<number | null>(null)

const confirmDelete = (id: number) => {
  pendingDeleteId.value = id
}

const handleDelete = async () => {
  if (pendingDeleteId.value === null) return
  const error = await destroyTask(pendingDeleteId.value)
  pendingDeleteId.value = null
  if (error) {
    toast.error('Failed to delete task.')
  } else {
    toast.success('Task deleted.')
  }
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 overflow-auto p-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Tasks</h1>
        <p class="text-muted-foreground">Manage your focus and productivity.</p>
      </div>
      <Button as-child>
        <NuxtLink to="/app/tasks/create">
          <Plus />
          New Task
        </NuxtLink>
      </Button>
    </div>

    <!-- Empty State -->
    <Empty v-if="tasks.length === 0" class="border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No Tasks Yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any tasks yet. Get started by creating your first task.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button as-child>
          <NuxtLink to="/app/tasks/create">
            <Plus />
            Create Task
          </NuxtLink>
        </Button>
      </EmptyContent>
    </Empty>

    <!-- Task List -->
    <div v-else class="space-y-3">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="group bg-card relative flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md"
        :class="{ 'opacity-60': task.status === 'complete' }"
      >
        <!-- Status Icon -->
        <div class="shrink-0">
          <CheckCircle2 v-if="task.status === 'complete'" class="text-primary size-6" />
          <PlayCircle
            v-else-if="task.status === 'in_progress'"
            class="text-primary size-6 animate-pulse"
          />
          <Circle v-else class="text-muted-foreground size-6" />
        </div>

        <!-- Content -->
        <div class="min-w-0 flex-1">
          <div class="mb-0.5 flex items-center gap-2">
            <NuxtLink
              :to="`/app/tasks/${task.id}`"
              class="truncate font-semibold underline-offset-4 hover:underline"
            >
              {{ task.name }}
            </NuxtLink>
            <Badge
              :variant="
                task.urgency === 'high'
                  ? 'destructive'
                  : task.urgency === 'medium'
                    ? 'default'
                    : task.urgency === 'low'
                      ? 'secondary'
                      : 'outline'
              "
              class="h-5 shrink-0 px-2 text-xs uppercase tracking-wider"
            >
              {{ task.urgency }}
            </Badge>
          </div>

          <div class="text-muted-foreground flex flex-wrap items-center gap-4 font-mono text-xs">
            <div v-if="task.deadline" class="flex items-center gap-1">
              <Calendar class="size-3" />
              {{ formatDate(new Date(task.deadline), 'dd MMM') }}
            </div>
            <div v-if="task.timeEstimateMin" class="flex items-center gap-1">
              <Timer class="size-3" />
              {{
                formatDuration(task.timeEstimateMin * 60 * 1000, { format: 'hhh mmm', pad: false })
              }}
            </div>
            <div class="flex items-center gap-1">
              <Clock class="size-3" />
              {{ formatDuration(task.stopwatchMs || 0, { format: 'hh:mm' }) }}
            </div>
            <div class="flex items-center gap-1">
              <span class="opacity-60">Pomos:</span>
              {{ task.pomoCount }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreVertical class="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-40">
            <DropdownMenuItem as-child>
              <NuxtLink :to="`/app/tasks/${task.id}/edit`">
                <Edit2 class="size-4" />
                Edit
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="text-destructive cursor-pointer"
              @click="confirmDelete(task.id)"
            >
              <Trash2 class="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog :open="pendingDeleteId !== null">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The task will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" @click="handleDelete()">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>

  <!-- Nested routes used for modals -->
  <NuxtPage />
</template>
