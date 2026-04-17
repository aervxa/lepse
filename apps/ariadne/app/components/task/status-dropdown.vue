<script setup lang="ts">
import { toast } from 'vue-sonner'

defineProps<{
  id: number
  status: string
}>()

const { updateTask } = useTasks()

const setStatus = async (
  taskId: number,
  status: NonNullable<Parameters<typeof updateTask>[1]>['status']
) => {
  const error = await updateTask(taskId, { status })
  if (error) toast.error('Failed to update status.')
  else toast.success('Task status updated.')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child :title="`status: ${status}`">
      <slot>
        <Button variant="ghost" size="icon-sm">
          <TaskStatusIcon :status="status" />
        </Button>
      </slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuCheckboxItem
        v-for="s in ['todo', 'in_progress', 'done', 'canceled'] as const"
        :key="s"
        :model-value="status === s"
        @click="setStatus(id, s)"
      >
        <TaskStatusIcon :status="s" />
        {{ s.replace('_', ' ') }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
