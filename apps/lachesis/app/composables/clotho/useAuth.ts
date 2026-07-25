import type { Data } from '@lepse/clotho/data'

export const useAuth = () => {
  const { $clotho } = useNuxtApp()
  const token = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 365 /* one  year */ })
  const user = useState<Data.User | undefined>('user', () => undefined)

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => {
    const [payload, error] = await $clotho.api.auth.newAccount
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
    const [payload, error] = await $clotho.api.auth.accessToken
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
    await $clotho.api.auth.accessToken.destroy({})
    token.value = null
    user.value = undefined
    navigateTo('/')
  }

  const refreshUser = async () => {
    if (token.value) {
      const [payload, error] = await $clotho.api.account.profile.show({}).safe()
      if (payload) {
        user.value = payload.data
      } else {
        // If user is not authorized (user doesn't exist in the server)
        if (error.isStatus(401)) {
          token.value = null
          user.value = undefined
          navigateTo('/')
        }
        console.error(error)
        return error
      }
    }
  }

  const verifyEmailRequest = async () => {
    const [, error] = await $clotho.api.verify.email.request({}).safe()
    if (error) {
      console.error(error)
      return error
    }
  }
  const verifyEmail = async (token: string) => {
    const [, error] = await $clotho.api.verify.email({ params: { token } }).safe()
    if (error) {
      console.error(error)
      return error
    } else {
      refreshUser()
    }
  }

  const updateProfile = async (
    body: Parameters<typeof $clotho.api.account.profile.update>['0']['body']
  ) => {
    const [payload, error] = await $clotho.api.account.profile.update({ body }).safe()
    if (payload) {
      user.value = payload.data
    } else {
      console.error(error)
      return error
    }
  }

  return {
    user,
    signup,
    login,
    logout,
    refreshUser,
    verifyEmail,
    verifyEmailRequest,
    updateProfile,
  }
}
