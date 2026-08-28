import { useMutation, useQuery } from '@tanstack/vue-query'

export const useGoals = () => {
  const { $api, $queryClient } = useNuxtApp()

  const goalsQuery = useQuery($api.goals.index.queryOptions())
  const goals = computed(() => goalsQuery.data.value?.data)

  const createGoalMutation = useMutation(
    $api.goals.store.mutationOptions({
      onSuccess: ({ data }) => {
        $queryClient.setQueryData(
          $api.goals.index.queryKey(),
          (old) => old && { ...old, data: [...old.data.filter((i) => i.id !== data.id), data] }
        )
      },
    })
  )

  const updateGoalMutation = useMutation(
    $api.goals.update.mutationOptions({
      onSuccess: ({ data }) => {
        $queryClient.setQueryData(
          $api.goals.index.queryKey(),
          (old) => old && { ...old, data: [...old.data.filter((i) => i.id !== data.id), data] }
        )
      },
    })
  )

  const destroyGoalMutation = useMutation(
    $api.goals.destroy.mutationOptions({
      onSuccess: (_, { params: { id } }) => {
        $queryClient.setQueryData(
          $api.goals.index.queryKey(),
          (old) => old && { ...old, data: old.data.filter((i) => i.id !== id) }
        )
      },
    })
  )

  return { goalsQuery, goals, createGoalMutation, updateGoalMutation, destroyGoalMutation }
}
