export default defineNuxtPlugin({
  name: 'auth',
  dependsOn: ['minos'],
  async setup() {
    const { refreshUser } = useAuth()
    await refreshUser()
  },
})
