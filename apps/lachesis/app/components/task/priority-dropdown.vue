<script setup lang="ts">
import type { DropdownMenuContentProps } from 'reka-ui'
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

const { updateTaskMutation } = useTasks()
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
        @click="
          updateTaskMutation.mutate(
            { params: { id }, body: { priority: p } },
            {
              onError: (err) =>
                toast.error('Failed to update priority.', { description: err.message }),
              onSuccess: () => toast.success('Task priority updated.'),
            }
          )
        "
      >
        <TaskPriorityIcon :priority="p" />
        {{ p.replace('_', ' ') }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
