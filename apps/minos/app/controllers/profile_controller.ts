import UserTransformer from '#transformers/user_transformer'
import { updateAvatarValidator } from '#validators/profile'
import type { HttpContext } from '@adonisjs/core/http'
import string from '@adonisjs/core/helpers/string'
import drive from '@adonisjs/drive/services/main'
import logger from '@adonisjs/core/services/logger'

export default class ProfileController {
  async show({ auth, serialize }: HttpContext) {
    return serialize(UserTransformer.transform(auth.getUserOrFail()))
  }

  async updateAvatar({ request, auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateAvatarValidator)
    const avatarFileName = `avatars/${string.uuid()}.${payload.avatar.extname}`
    const oldAvatar = user.avatar

    // Save new avatar
    await payload.avatar.moveToDisk(avatarFileName)

    // Set new avatar
    user.avatar = avatarFileName
    await user.save()

    // Delete old avatar
    if (oldAvatar) {
      await drive
        .use()
        .delete(oldAvatar)
        .catch((error) => {
          // Don't let old avatar delete failing warn user
          logger.warn(
            {
              error,
              oldAvatar,
              user,
            },
            "Failed to delete user's old avatar"
          )
        })
    }

    return response.created(await serialize(UserTransformer.transform(user)))
  }
}
