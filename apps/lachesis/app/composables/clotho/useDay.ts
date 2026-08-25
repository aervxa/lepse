import { useMutation, useQuery } from '@tanstack/vue-query'

export const useDay = (date: string = getClientDate()) => {
  const { $api, $client, $queryClient } = useNuxtApp()

  // ─── Session ──────────────────────────────────────────────────────────────

  const focusSessionQuery = useQuery($api.day.session.show.queryOptions({ params: { date } }))
  const focusSession = computed(() => focusSessionQuery.data.value?.data)

  const updateFocusSessionMutation = useMutation({
    mutationFn: ({
      body,
    }: {
      body: Parameters<typeof $client.api.day.session.update>[0]['body']
    }) => $client.api.day.session.update({ params: { date }, body }),
    onSuccess: (data) => {
      $queryClient.setQueryData($api.day.session.show.queryKey({ params: { date } }), data)
    },
  })

  const destroyFocusSessionMutation = useMutation({
    mutationFn: () => $client.api.day.session.destroy({ params: { date } }),
    onSuccess: () => {
      $queryClient.resetQueries({
        queryKey: $api.day.session.show.queryKey({ params: { date } }),
      })
    },
  })

  const sessionReturns = {
    focusSessionQuery,
    focusSession,
    updateFocusSessionMutation,
    destroyFocusSessionMutation,
  }

  // ─── Returns ──────────────────────────────────────────────────────────────

  return { ...sessionReturns }
}
