export default defineNuxtPlugin({
  name: 'auth',
  dependsOn: ['clotho'],
  async setup() {
    const { refreshUser } = useAuth()
    await refreshUser()
  },
})
