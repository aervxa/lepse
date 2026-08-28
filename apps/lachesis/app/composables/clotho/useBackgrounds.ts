import { useMutation, useQuery } from '@tanstack/vue-query'

export const useBackgrounds = () => {
  const { $api, $queryClient } = useNuxtApp()

  const backgroundsQuery = useQuery($api.backgrounds.index.queryOptions())
  const backgrounds = computed(() => backgroundsQuery.data.value?.data)

  const backgroundSelectMutation = useMutation(
    $api.backgrounds.select.mutationOptions({
      onSuccess: ({ data }) => {
        $queryClient.setQueryData($api.account.profile.show.queryKey(), { data: data.user })
      },
    })
  )

  return { backgroundsQuery, backgrounds, backgroundSelectMutation }
}
