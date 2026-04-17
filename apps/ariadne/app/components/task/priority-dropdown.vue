<script setup lang="ts">
import { toast } from 'vue-sonner'

defineProps<{
  id: number
  priority: string
  text?: boolean
}>()

const { updateTask } = useTasks()

const setPriority = async (
  taskId: number,
  priority: NonNullable<Parameters<typeof updateTask>[1]>['priority']
) => {
  const error = await updateTask(taskId, { priority })
  if (error) toast.error('Failed to update priority.')
  else toast.success('Task priority updated.')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child :title="`priority: ${priority}`">
      <slot>
        <Button variant="ghost" size="icon-sm">
          <TaskPriorityIcon :priority="priority" />
        </Button>
      </slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuCheckboxItem
        v-for="p in ['none', 'urgent', 'high', 'medium', 'low'] as const"
        :key="p"
        :model-value="priority === p"
        @click="setPriority(id, p)"
      >
        <TaskPriorityIcon :priority="p" />
        {{ p.replace('_', ' ') }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
