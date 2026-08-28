import User from '#models/user'
import token_service from '#services/token_service'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

export default class VerifyEmailController {
  // Web view to show user their email is verified
  async index({ params, view }: HttpContext) {
    const payload = token_service.verifyEmailVerificationToken(params.token)

    if (!payload) {
      throw new Exception('Your token is invalid or expired!', { status: 401 })
    }

    const user = await User.findOrFail(payload.userId)
    user.emailVerified = true
    await user.save()

    return view.render('pages/verify/email')
  }

  // Request email verification link to email
  async store({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await user.sendVerifyEmail()

    return response.noContent()
  }
}
