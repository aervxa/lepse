import { useMutation, useQuery } from '@tanstack/vue-query'

export const useTasks = () => {
  const { $api, $queryClient } = useNuxtApp()

  const tasksQuery = useQuery($api.tasks.index.queryOptions())
  const tasks = computed(() => tasksQuery.data.value?.data)
  const focusedTaskId = useState<number>('focusedTaskId', () => -1)

  const createTaskMutation = useMutation(
    $api.tasks.store.mutationOptions({
      onSuccess: ({ data }) => {
        $queryClient.setQueryData(
          $api.tasks.index.queryKey(),
          (old) => old && { ...old, data: [...old.data.filter((i) => i.id !== data.id), data] }
        )
      },
    })
  )

  const updateTaskMutation = useMutation(
    $api.tasks.update.mutationOptions({
      onSuccess: ({ data }) => {
        $queryClient.setQueryData(
          $api.tasks.index.queryKey(),
          (old) => old && { ...old, data: [...old.data.filter((i) => i.id !== data.id), data] }
        )
      },
    })
  )

  const destroyTaskMutation = useMutation(
    $api.tasks.destroy.mutationOptions({
      onSuccess: (_, { params: { id } }) => {
        $queryClient.setQueryData(
          $api.tasks.index.queryKey(),
          (old) => old && { ...old, data: old.data.filter((i) => i.id !== id) }
        )
      },
    })
  )

  const attachGoalMutation = useMutation(
    $api.tasks.attachGoal.mutationOptions({
      onSuccess: ({ data }) => {
        $queryClient.setQueryData(
          $api.tasks.index.queryKey(),
          (old) => old && { ...old, data: [...old.data.filter((i) => i.id !== data.id), data] }
        )
      },
    })
  )

  const detachGoalMutation = useMutation(
    $api.tasks.attachGoal.mutationOptions({
      onSuccess: ({ data }) => {
        $queryClient.setQueryData(
          $api.tasks.index.queryKey(),
          (old) => old && { ...old, data: [...old.data.filter((i) => i.id !== data.id), data] }
        )
      },
    })
  )

  return {
    tasksQuery,
    tasks,
    focusedTaskId,
    createTaskMutation,
    updateTaskMutation,
    destroyTaskMutation,
    attachGoalMutation,
    detachGoalMutation,
  }
}
