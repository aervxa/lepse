import PasswordResetNotification from '#mails/password_reset_notification'
import User from '#models/user'
import token_service from '#services/token_service'
import { resetPasswordRequestValidator, resetPasswordValidator } from '#validators/user'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import limiter from '@adonisjs/limiter/services/main'
import mail from '@adonisjs/mail/services/main'
import { ValidationError } from '@vinejs/vine'

const requestLimiter = limiter.use({ requests: 1, duration: '1 minute' })

export default class VerifyEmailController {
  // Web view for password reset form
  async index({ params, view }: HttpContext) {
    const payload = token_service.verifyPasswordResetToken(params.token)

    if (!payload) {
      throw new Exception('Your token is invalid or expired!', { status: 401 })
    }

    return view.render('pages/verify/password-reset', { token: params.token })
  }

  // Request password reset link to email
  async store({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(resetPasswordRequestValidator)

    const user = await User.findByOrFail('email', email)

    // Consume limit only if user found
    await requestLimiter.consume(`${user.id}.password-reset`)

    const token = token_service.createPasswordResetToken(user.id)
    await mail.sendLater(new PasswordResetNotification(user, token))

    return response.noContent()
  }

  // Password reset
  async update({ params, request, session, response }: HttpContext) {
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
