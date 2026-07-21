<script setup lang="ts">
import type { DropdownMenuContentProps } from 'reka-ui';
import { toast } from 'vue-sonner'

defineProps<{
  id: number
  priority: string
  text?: boolean
  disabled?: boolean
  align?: DropdownMenuContentProps['align']
  side?: DropdownMenuContentProps['side']
}>()
const open = defineModel<boolean>('open')

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
  <DropdownMenu v-model:open="open">
    <DropdownMenuTrigger as-child :title="`priority: ${priority}`" :disabled>
      <slot>
        <Button variant="ghost" size="icon-sm">
          <TaskPriorityIcon :priority="priority" />
        </Button>
      </slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent :align :side>
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
