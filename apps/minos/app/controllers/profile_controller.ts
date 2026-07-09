import UserTransformer from '#transformers/user_transformer'
import { updateValidator } from '#validators/profile'
import type { HttpContext } from '@adonisjs/core/http'
import string from '@adonisjs/core/helpers/string'
import drive from '@adonisjs/drive/services/main'
import logger from '@adonisjs/core/services/logger'

export default class ProfileController {
  async show({ auth, serialize }: HttpContext) {
    return serialize(UserTransformer.transform(auth.getUserOrFail()))
  }

  async update({ request, auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateValidator)

    if (payload.name !== undefined) {
      user.fullName = payload.name
    }

    if (payload.avatar !== undefined) {
      const oldAvatar = user.avatar // Save for deletion

      if (payload.avatar) {
        const avatarFileName = `avatars/${string.uuid()}.${payload.avatar.extname}`

        // Save new avatar
        await payload.avatar.moveToDisk(avatarFileName)

        // Set new avatar
        user.avatar = avatarFileName
      } else {
        user.avatar = null
      }

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
    }

    if (user.isDirty()) {
      await user.save()
    }

    return response.created(await serialize(UserTransformer.transform(user)))
  }
}
