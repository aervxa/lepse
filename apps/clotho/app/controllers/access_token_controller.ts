import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import app from '@adonisjs/core/services/app'

export default class AccessTokenController {
  async store({ request, response, serialize, isApp }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    const tokenValue = token.value!.release()

    response.cookie('auth_token', tokenValue, {
      path: '/',
      httpOnly: true,
      secure: app.inProduction, // NOTE: for working in development
      sameSite: 'lax', // NOTE: for developemnt, the backend must be running on the same host as the frontend
      maxAge: '1y',
    })

    return serialize({
      user: UserTransformer.transform(user),
      ...(isApp ? { token: tokenValue } : {}),
    })
  }

  async destroy({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    response.clearCookie('auth_token', { path: '/' })

    return {
      message: 'Logged out successfully',
    }
  }
}
