export default defineNuxtPlugin({
  name: 'auth',
  dependsOn: ['clotho'],
  async setup(app) {
    const token = useCookie('auth_token')
    if (!token.value) return

    await app.$queryClient.prefetchQuery(
      app.$api.account.profile.show.queryOptions(undefined, { retry: false })
    )
  },
})
