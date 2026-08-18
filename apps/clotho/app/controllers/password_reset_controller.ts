import PasswordResetNotification from '#mails/password_reset_notification'
import User from '#models/user'
import token_service from '#services/token_service'
import { resetPasswordValidator } from '#validators/user'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import { ValidationError } from '@vinejs/vine'

export default class VerifyEmailController {
  async request({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    const token = token_service.createPasswordResetToken(user.id)
    await mail.sendLater(new PasswordResetNotification(user, token))

    return response.noContent()
  }

  async verify({ params, view }: HttpContext) {
    const payload = token_service.verifyPasswordResetToken(params.token)

    if (!payload) {
      throw new Exception('Your token is invalid or expired!', { status: 401 })
    }

    return view.render('pages/verify/password-reset', { token: params.token })
  }

  async reset({ params, request, session, response }: HttpContext) {
    const payload = token_service.verifyPasswordResetToken(params.token)

    if (!payload) {
      throw new Exception('Your token is invalid or expired!', { status: 401 })
    }

    let password: string

    // Try block, to handle validating errors manually
    try {
      const validatedReq = await request.validateUsing(resetPasswordValidator)
      password = validatedReq.password
    } catch (error) {
      if (error instanceof ValidationError) {
        session.flashAll()
        session.flash('error', error.messages[0]?.message)
        return response.redirect().back()
      }

      throw error
    }

    if (!password) {
      throw new Exception('Something went wrong!', { status: 500 })
    }

    const user = await User.findOrFail(payload.userId)
    user.password = password
    await user.save()
    session.flash('success', 'Password reset successfully!')
    return response.redirect().back()
  }
}
