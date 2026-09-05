import { useMutation, useQuery } from '@tanstack/vue-query'

export const useAuth = () => {
  const { $api, $queryClient } = useNuxtApp()

  const token = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 365 /* one  year */ })
  const userQuery = useQuery($api.account.profile.show.queryOptions())
  const user = computed(() => userQuery.data.value?.data)

  const loginMutation = useMutation(
    $api.auth.accessToken.store.mutationOptions({
      onSuccess: ({ data }) => {
        token.value = data.token
        $queryClient.setQueryData($api.account.profile.show.queryKey(), { data: data.user })
      },
    })
  )

  const signupMutation = useMutation(
    $api.auth.newAccount.store.mutationOptions({
      onSuccess: ({ data }) => {
        token.value = data.token
        $queryClient.setQueryData($api.account.profile.show.queryKey(), { data: data.user })
      },
    })
  )

  const logoutMutation = useMutation(
    $api.auth.accessToken.destroy.mutationOptions({
      onSuccess: () => {
        token.value = null
        $queryClient.resetQueries() // NOTE: needs to be called before clear
        $queryClient.clear() // clear everything (persisted cache too)
      },
    })
  )

  const requestEmailVerificationMutation = useMutation($api.verify.email.request.mutationOptions())
  const requestPasswordResetMutation = useMutation($api.reset.password.request.mutationOptions())

  const queryKey = $api.account.profile.show.queryKey()
  const updateProfileMutation = useMutation(
    $api.account.profile.update.mutationOptions({
      onMutate: async ({ body }) => {
        await $queryClient.cancelQueries({ queryKey })
        const old = $queryClient.getQueryData(queryKey)

        $queryClient.setQueryData(
          queryKey,
          (old) =>
            old && {
              data: {
                ...old.data,
                name: body?.name ?? old.data.name,
                /* avatarUrl cannot be updated, since the url comes computed from the server (obviously) */
              },
            }
        )

        return { old }
      },
      onError: (_err, _req, onMutateResult) => {
        $queryClient.setQueryData(queryKey, onMutateResult?.old)
      },
      onSuccess: ({ data }) => {
        // If this is the only mutation (to have LAST entry take precedense)
        if (
          $queryClient.isMutating({ mutationKey: $api.account.profile.update.mutationKey() }) === 1
        )
          $queryClient.setQueryData(queryKey, { data: data.user })
      },
    })
  )

  return {
    userQuery,
    user,
    loginMutation,
    signupMutation,
    logoutMutation,
    requestEmailVerificationMutation,
    requestPasswordResetMutation,
    updateProfileMutation,
  }
}
