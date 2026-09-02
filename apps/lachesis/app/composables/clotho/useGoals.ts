import { useMutation, useQuery } from '@tanstack/vue-query'

export const useGoals = () => {
  const { $api, $queryClient } = useNuxtApp()

  const goalsQuery = useQuery($api.goals.index.queryOptions())
  const goals = computed(() => goalsQuery.data.value?.data)

  const queryKey = $api.goals.index.queryKey()

  const createGoalMutation = useMutation(
    $api.goals.store.mutationOptions({
      onSuccess: ({ data }) => {
        $queryClient.setQueryData(
          queryKey,
          (old) => old && { ...old, data: [...old.data.filter((i) => i.id !== data.id), data] }
        )
      },
    })
  )

  const updateGoalMutation = useMutation(
    $api.goals.update.mutationOptions({
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
        if ($queryClient.isMutating({ mutationKey: $api.goals.update.mutationKey() }) === 1)
          $queryClient.setQueryData(
            queryKey,
            (old) => old && { ...old, data: [...old.data.filter((i) => i.id !== data.id), data] }
          )
      },
    })
  )

  const destroyGoalMutation = useMutation(
    $api.goals.destroy.mutationOptions({
      onSuccess: (_, { params: { id } }) => {
        $queryClient.setQueryData(
          queryKey,
          (old) => old && { ...old, data: old.data.filter((i) => i.id !== id) }
        )
      },
    })
  )

  return { goalsQuery, goals, createGoalMutation, updateGoalMutation, destroyGoalMutation }
}
