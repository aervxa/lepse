import type { Data } from '@lepse/minos/data'

export const useAuth = () => {
  const { $minos } = useNuxtApp()
  const token = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 365 /* one  year */ })
  const user = useState<Data.User | undefined>('user', () => undefined)

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => {
    const [payload, error] = await $minos.api.auth.newAccount
      .store({ body: { fullName, email, password, passwordConfirmation } })
      .safe()
    if (payload) {
      token.value = payload.data.token
      user.value = payload.data.user
    } else {
      console.error(error)
      return error
    }
  }

  const login = async (email: string, password: string) => {
    const [payload, error] = await $minos.api.auth.accessToken
      .store({ body: { email, password } })
      .safe()
    if (payload) {
      token.value = payload.data.token
      user.value = payload.data.user
    } else {
      console.error(error)
      return error
    }
  }

  const logout = async () => {
    await $minos.api.auth.accessToken.destroy({})
    token.value = null
    user.value = undefined
    navigateTo('/')
  }

  const refreshUser = async () => {
    const { data } = await $minos.api.account.profile.show({})
    user.value = data
  }

  return { user, signup, login, logout, token, refreshUser }
}
