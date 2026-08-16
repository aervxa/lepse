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

const { updateGoal } = useGoals()

const setStatus = async (
  goalId: number,
  status: NonNullable<Parameters<typeof updateGoal>[1]>['status']
) => {
  const error = await updateGoal(goalId, { status })
  if (error) toast.error('Failed to update status.')
  else toast.success('Goal status updated.')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child :title="`status: ${status}`">
      <slot>
        <Button variant="outline" size="xs">
          <GoalStatusIcon :status="status" />
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
        @click="setStatus(id, s)"
      >
        <GoalStatusIcon :status="s" />
        {{ s.replace('_', ' ') }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
