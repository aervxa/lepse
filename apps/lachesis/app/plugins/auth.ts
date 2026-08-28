export default defineNuxtPlugin({
  name: 'auth',
  dependsOn: ['clotho'],
  async setup(app) {
    await app.$queryClient.prefetchQuery(
      app.$api.account.profile.show.queryOptions({}, { retry: false })
    )
  },
})
