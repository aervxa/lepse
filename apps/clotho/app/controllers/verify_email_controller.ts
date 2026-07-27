import Token from '#models/token'
import type { HttpContext } from '@adonisjs/core/http'

export default class VerifyEmailController {
  async request({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await user.sendVerifyEmail()

    return response.noContent()
  }

  async verify({ params, response }: HttpContext) {
    const user = await Token.getUser(params.token)

    if (!user) {
      return response.unauthorized('Your token is invalid or expired')
    }

    user.emailVerified = true
    await user.save()

    await Token.expireAll(user, 'VERIFY_EMAIL')

    return response.noContent()
  }
}
