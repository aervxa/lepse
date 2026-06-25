<script setup lang="ts">
import { ArrowUpRight, Link, Unlink } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const { id } = defineProps<{
  id: number
}>()

const { tasks, updateTask } = useTasks()
const { goals } = useGoals()

const task = computed(() => tasks.value.find((t) => t.id === id))
const goal = computed(() => goals.value.find((g) => g.id === task.value?.goalId))

const linkGoal = async (goalId: number | null) => {
  if (task.value) {
    const error = await updateTask(task.value.id, { goalId })
    if (error) toast.error('Failed to link goal.')
    else toast.success(goalId === null ? 'Goal unlinked.' : 'Goal linked.')
  }
}
</script>

<template>
  <ContextMenu v-if="goal">
    <ContextMenuTrigger as-child>
      <Button variant="ghost" size="xs" as-child>
        <NuxtLink :to="`/shell/goals/${goal.id}`">
          <Link />
          {{ goal.name }}
        </NuxtLink>
      </Button>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem as-child>
        <NuxtLink :to="`/shell/goals/${goal.id}`">
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
    empty="No goals found."
    placeholder="Search a goal"
  >
    <Button variant="ghost" size="xs">
      <Link />
      <span class="text-muted-foreground italic">none</span>
    </Button>
  </Combobox>
</template>
