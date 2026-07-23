import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

export default class NewAccountController {
  async store({ request, serialize }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(signupValidator)

    const user = await User.create({
      fullName: fullName ?? email.split('@')[0] /* Fallback to email prefix */,
      email,
      password,
    })
    const token = await User.accessTokens.create(user)
    await user.sendVerifyEmail()

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }
}
