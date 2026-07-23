import Token from '#models/token'
import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class VerifyEmailController {
  async request({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    // TODO: Later use @adonisjs/limiter
    const token = await Token.getLast(user, 'VERIFY_EMAIL')
    if (token) {
      const diff = token.createdAt?.diffNow('minutes').minutes
      if (diff && Math.abs(diff) < 1) {
        return response.tooManyRequests()
      }
    }

    await user.sendVerifyEmail()

    return response.noContent()
  }

  async verify({ params, response, serialize }: HttpContext) {
    const user = await Token.getUser(params.token)

    if (!user) {
      return response.unauthorized('Your token is invalid or expired')
    }

    user.emailVerified = true
    await user.save()

    await Token.expireAll(user, 'VERIFY_EMAIL')

    return serialize(UserTransformer.transform(user))
  }
}
