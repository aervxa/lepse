import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin({
  name: 'auth',
  dependsOn: ['minos'],
  async setup() {
    const { token, refreshUser } = useAuth()

    if (token.value) {
      await refreshUser()
    }
  },
})
