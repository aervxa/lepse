import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin({
  name: 'auth',
  dependsOn: ['minos'],
  async setup() {
    const { refreshUser } = useAuth()
    await refreshUser()
  },
})
