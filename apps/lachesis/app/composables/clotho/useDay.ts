import { useMutation, useQuery } from '@tanstack/vue-query'

export const useDay = (date: string = getClientDate()) => {
  const { $api, $queryClient } = useNuxtApp()

  // ─── Session ──────────────────────────────────────────────────────────────

  const focusSessionQuery = useQuery($api.day.session.show.queryOptions({ params: { date } }))
  const focusSession = computed(() => focusSessionQuery.data.value?.data)

  const updateFocusSessionMutation = useMutation(
    $api.day.session.update.mutationOptions({
      onSuccess: (data) => {
        $queryClient.setQueryData($api.day.session.show.queryKey({ params: { date } }), data)
      },
    })
  )

  const destroyFocusSessionMutation = useMutation(
    $api.day.session.destroy.mutationOptions({
      onSuccess: () => {
        $queryClient.resetQueries({
          queryKey: $api.day.session.show.queryKey({ params: { date } }),
        })
      },
    })
  )

  const sessionReturns = {
    focusSessionQuery,
    focusSession,
    updateFocusSessionMutation,
    destroyFocusSessionMutation,
  }

  // ─── Returns ──────────────────────────────────────────────────────────────

  return { ...sessionReturns }
}
