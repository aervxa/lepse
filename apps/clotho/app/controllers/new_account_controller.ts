import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import app from '@adonisjs/core/services/app'

export default class NewAccountController {
  async store({ request, response, serialize, isApp }: HttpContext) {
    const { name, email, password } = await request.validateUsing(signupValidator)

    const user = await User.create({
      name: name ?? email.split('@')[0] /* Fallback to email prefix */,
      email,
      password,
    })
    await user.sendVerifyEmail()
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
}
