import { useMutation, useQuery } from '@tanstack/vue-query'

export const useDay = (date: string = getClientDate()) => {
  const { $api, $queryClient } = useNuxtApp()

  // ─── Session ──────────────────────────────────────────────────────────────

  const focusSessionQuery = useQuery($api.day.session.show.queryOptions({ params: { date } }))
  const focusSession = computed(() => focusSessionQuery.data.value?.data)

  const sessionQueryKey = (
    params: NonNullable<Parameters<typeof $api.day.session.show.queryKey>['0']>['params']
  ) => $api.day.session.show.queryKey({ params })

  const updateFocusSessionMutation = useMutation(
    $api.day.session.update.mutationOptions({
      onMutate: async ({ params, body }) => {
        const qK = sessionQueryKey(params)
        await $queryClient.cancelQueries({ queryKey: qK })
        const old = $queryClient.getQueryData(qK)

        $queryClient.setQueryData(
          qK,
          (old) =>
            old && {
              data: {
                ...old.data,
                pomoCount: Number(body?.pomoCount ?? old.data.pomoCount),
                stopwatchMs: Number(body?.stopwatchMs ?? old.data.stopwatchMs),
              },
            }
        )

        return { old }
      },
      onError: (_err, { params }, onMutateResult) => {
        $queryClient.setQueryData(sessionQueryKey(params), onMutateResult?.old)
      },
      onSuccess: (data, { params }) => {
        // If this is the only mutation (to have LAST entry take precedense)
        if ($queryClient.isMutating({ mutationKey: $api.day.session.update.mutationKey() }) === 1)
          $queryClient.setQueryData(sessionQueryKey(params), data)
      },
    })
  )

  const destroyFocusSessionMutation = useMutation(
    $api.day.session.destroy.mutationOptions({
      onMutate: async ({ params }) => {
        const qK = sessionQueryKey(params)
        await $queryClient.cancelQueries({ queryKey: qK })
        const old = $queryClient.getQueryData(qK)

        $queryClient.setQueryData(qK, undefined)

        return { old }
      },
      onError: (_err, { params }, onMutateResult) => {
        $queryClient.setQueryData(sessionQueryKey(params), onMutateResult?.old)
      },
      onSuccess: (_data, { params }) => {
        // If this is the only mutation (to have LAST entry take precedense)
        if ($queryClient.isMutating({ mutationKey: $api.day.session.destroy.mutationKey() }) === 1)
          $queryClient.resetQueries({ queryKey: sessionQueryKey(params) })
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
