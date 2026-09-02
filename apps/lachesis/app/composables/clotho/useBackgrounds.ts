import { useMutation, useQuery } from '@tanstack/vue-query'

export const useBackgrounds = () => {
  const { $api, $queryClient } = useNuxtApp()

  const backgroundsQuery = useQuery($api.backgrounds.index.queryOptions())
  const backgrounds = computed(() => backgroundsQuery.data.value?.data)

  const queryKey = $api.account.profile.show.queryKey()
  const backgroundSelectMutation = useMutation(
    $api.backgrounds.select.mutationOptions({
      onMutate: async (req) => {
        await $queryClient.cancelQueries({ queryKey })
        const old = $queryClient.getQueryData(queryKey)

        $queryClient.setQueryData(
          queryKey,
          (old) => old && { data: { ...old.data, backgroundId: Number(req.body.id) } }
        )

        return { old }
      },
      onError: (_err, _req, onMutateResult) => {
        $queryClient.setQueryData(queryKey, onMutateResult?.old)
      },
      onSuccess: ({ data }) => {
        // If this is the only mutation (to have LAST entry take precedense)
        if ($queryClient.isMutating({ mutationKey: $api.backgrounds.select.mutationKey() }) === 1)
          $queryClient.setQueryData($api.account.profile.show.queryKey(), { data: data.user })
      },
    })
  )

  return { backgroundsQuery, backgrounds, backgroundSelectMutation }
}
