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
        $queryClient.removeQueries({ queryKey: $api.account.profile.show.queryKey() })
      },
    })
  )

  const requestEmailVerificationMutation = useMutation($api.verify.email.request.mutationOptions())
  const requestPasswordResetMutation = useMutation($api.reset.password.request.mutationOptions())

  const updateProfileMutation = useMutation(
    $api.account.profile.update.mutationOptions({
      onSuccess: ({ data }) => {
        $queryClient.setQueryData($api.account.profile.show.queryKey(), { data: data.user })
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
