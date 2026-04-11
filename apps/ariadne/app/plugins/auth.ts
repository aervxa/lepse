import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async () => {
  const { token, refreshUser } = useAuth()

  if (token.value) {
    await refreshUser()
  }
})
