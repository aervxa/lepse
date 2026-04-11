import type { Data } from '@lepse/minos/data'

export const useAuth = () => {
  const { $minos } = useNuxtApp()
  const token = useCookie('auth_token')
  const user = useState<Data.User | undefined>('user', () => undefined)

  const login = async (email: string, password: string) => {
    const { data } = await $minos.api.auth.accessToken.store({ body: { email, password } })
    token.value = data.token
    user.value = data.user
  }

  const logout = async () => {
    await $minos.api.auth.accessToken.destroy({})
    token.value = null
    user.value = undefined
  }

  const refreshUser = async () => {
    const { data } = await $minos.api.account.profile.show({})
    user.value = data
  }

  return { user, login, logout, token, refreshUser }
}
