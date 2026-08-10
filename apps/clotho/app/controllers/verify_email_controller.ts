import User from '#models/user'
import token_service from '#services/token_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class VerifyEmailController {
  async request({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await user.sendVerifyEmail()

    return response.noContent()
  }

  async verify({ params, response }: HttpContext) {
    const payload = token_service.verifyEmailVerificationToken(params.token)

    if (!payload) {
      return response.unauthorized('Your token is invalid or expired')
    }

    const user = await User.findOrFail(payload.userId)
    user.emailVerified = true
    await user.save()

    return response.noContent()
  }
}
