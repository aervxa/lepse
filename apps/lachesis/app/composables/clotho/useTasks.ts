import { useMutation, useQuery } from '@tanstack/vue-query'

export const useTasks = () => {
  const { $api, $queryClient } = useNuxtApp()

  const tasksQuery = useQuery($api.tasks.index.queryOptions())
  const tasks = computed(() => tasksQuery.data.value?.data)
  const focusedTaskId = useState<number>('focusedTaskId', () => -1)

  const queryKey = $api.tasks.index.queryKey()

  const createTaskMutation = useMutation(
    $api.tasks.store.mutationOptions({
      onSuccess: ({ data }) => {
        $queryClient.setQueryData(
          queryKey,
          (old) => old && { ...old, data: [...old.data.filter((i) => i.id !== data.id), data] }
        )
      },
    })
  )

  const updateTaskMutation = useMutation(
    $api.tasks.update.mutationOptions({
      onMutate: async ({ params, body }) => {
        await $queryClient.cancelQueries({ queryKey })
        const old = $queryClient.getQueryData(queryKey)

        $queryClient.setQueryData(queryKey, (old) => {
          const task = old?.data.find((t) => t.id === params.id)
          if (!old || !task) return old
          return {
            ...old,
            data: [
              ...old.data.filter((t) => t.id !== params.id),
              {
                ...task,
                name: body?.name ?? task.name,
                description: body?.description ?? task.description,
                status: body?.status ?? task.status,
                priority: body?.priority ?? task.priority,
                pomoCount: Number(body?.pomoCount ?? task.pomoCount),
                stopwatchMs: Number(body?.stopwatchMs ?? task.stopwatchMs),
              },
            ],
          }
        })

        return { old }
      },
      onError: (_err, _req, onMutateResult) => {
        $queryClient.setQueryData(queryKey, onMutateResult?.old)
      },
      onSuccess: ({ data }) => {
        // If this is the only mutation (to have LAST entry take precedense)
        if ($queryClient.isMutating({ mutationKey: $api.tasks.update.mutationKey() }) === 1)
          $queryClient.setQueryData(
            queryKey,
            (old) => old && { ...old, data: [...old.data.filter((i) => i.id !== data.id), data] }
          )
      },
    })
  )

  const destroyTaskMutation = useMutation(
    $api.tasks.destroy.mutationOptions({
      onSuccess: (_, { params: { id } }) => {
        $queryClient.setQueryData(
          queryKey,
          (old) => old && { ...old, data: old.data.filter((i) => i.id !== id) }
        )
      },
    })
  )

  const attachGoalMutation = useMutation(
    $api.tasks.attachGoal.mutationOptions({
      onMutate: async ({ params }) => {
        await $queryClient.cancelQueries({ queryKey })
        const old = $queryClient.getQueryData(queryKey)

        $queryClient.setQueryData(queryKey, (old) => {
          const task = old?.data.find((t) => t.id === params.taskId)
          if (!old || !task) return old
          return {
            ...old,
            data: [
              ...old.data.filter((t) => t.id !== params.taskId),
              {
                ...task,
                goalIds: [...task.goalIds, Number(params.goalId)],
              },
            ],
          }
        })

        return { old }
      },
      onError: (_err, _req, onMutateResult) => {
        $queryClient.setQueryData(queryKey, onMutateResult?.old)
      },
      onSuccess: ({ data }) => {
        // If this is the only mutation (to have LAST entry take precedense)
        if ($queryClient.isMutating({ mutationKey: $api.tasks.attachGoal.mutationKey() }) === 1)
          $queryClient.setQueryData(
            queryKey,
            (old) => old && { ...old, data: [...old.data.filter((i) => i.id !== data.id), data] }
          )
      },
    })
  )

  const detachGoalMutation = useMutation(
    $api.tasks.detachGoal.mutationOptions({
      onMutate: async ({ params }) => {
        await $queryClient.cancelQueries({ queryKey })
        const old = $queryClient.getQueryData(queryKey)

        $queryClient.setQueryData(queryKey, (old) => {
          const task = old?.data.find((t) => t.id === params.taskId)
          if (!old || !task) return old
          return {
            ...old,
            data: [
              ...old.data.filter((t) => t.id !== params.taskId),
              {
                ...task,
                goalIds: task.goalIds.filter((id) => id !== params.goalId),
              },
            ],
          }
        })

        return { old }
      },
      onError: (_err, _req, onMutateResult) => {
        $queryClient.setQueryData(queryKey, onMutateResult?.old)
      },
      onSuccess: ({ data }) => {
        // If this is the only mutation (to have LAST entry take precedense)
        if ($queryClient.isMutating({ mutationKey: $api.tasks.detachGoal.mutationKey() }) === 1)
          $queryClient.setQueryData(
            queryKey,
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
