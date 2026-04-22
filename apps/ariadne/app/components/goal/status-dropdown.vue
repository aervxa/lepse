<script setup lang="ts">
import { toast } from 'vue-sonner'

defineProps<{
  id: number
  status: string
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
        </Button>
      </slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
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
