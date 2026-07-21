<script setup lang="ts">
import type { DropdownMenuContentProps } from 'reka-ui'
import { toast } from 'vue-sonner'

defineProps<{
  id: number
  status: string
  disabled?: boolean
  align?: DropdownMenuContentProps['align']
  side?: DropdownMenuContentProps['side']
}>()
const open = defineModel<boolean>('open')

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
  <DropdownMenu v-model:open="open">
    <DropdownMenuTrigger as-child :title="`status: ${status}`" :disabled>
      <slot>
        <Button variant="ghost" size="icon-sm">
          <TaskStatusIcon :status="status" />
        </Button>
      </slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent :align :side>
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
