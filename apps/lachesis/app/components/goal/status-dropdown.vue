<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import type { DropdownMenuContentProps } from 'reka-ui'
import { toast } from 'vue-sonner'

defineProps<{
  id: number
  status: string
  align?: DropdownMenuContentProps['align']
  side?: DropdownMenuContentProps['side']
}>()

const { updateGoalMutation } = useGoals()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child :title="`status: ${status}`">
      <slot>
        <Button variant="outline" size="xs">
          <GoalStatusIcon :status />
          {{ status }}
          <ChevronDown />
        </Button>
      </slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent :align :side>
      <DropdownMenuCheckboxItem
        v-for="s in ['active', 'completed', 'abandoned'] as const"
        :key="s"
        :model-value="status === s"
        @click="
          updateGoalMutation.mutate(
            { params: { id }, body: { status: s } },
            {
              onError: (err) =>
                toast.error('Failed to update status.', { description: err.message }),
              onSuccess: () => toast.success('Goal status updated.'),
            }
          )
        "
      >
        <GoalStatusIcon :status="s" />
        {{ s.replace('_', ' ') }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
