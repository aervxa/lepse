import UserTransformer from '#transformers/user_transformer'
import { updateValidator } from '#validators/profile'
import type { HttpContext } from '@adonisjs/core/http'
import string from '@adonisjs/core/helpers/string'
import drive from '@adonisjs/drive/services/main'
import logger from '@adonisjs/core/services/logger'
import { Transformer } from '@napi-rs/image'
import { readFile } from 'node:fs/promises'

export default class ProfileController {
  async show({ auth, serialize }: HttpContext) {
    return serialize(UserTransformer.transform(auth.getUserOrFail()))
  }

  async update({ request, auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateValidator)

    if (payload.name !== undefined) {
      user.name = payload.name
    }

    if (payload.avatar !== undefined) {
      const oldAvatar = user.avatar // Save for deletion

      if (payload.avatar) {
        // Process avatar into webp
        if (!payload.avatar.tmpPath)
          return response.internalServerError('Failed to process avatar, please try again later.')
        const inputBuffer = await readFile(payload.avatar.tmpPath)
        const webpBuffer = await new Transformer(inputBuffer)
          .fastResize({ width: 128, height: 128 }) // client should alr be sending 128x128, but to ensure consistency
          .webp(75)

        // Save processed avatar
        const avatarFileName = `avatars/${string.uuid()}.webp`
        await drive.use().put(avatarFileName, webpBuffer)

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

    return serialize({ user: UserTransformer.transform(user) })
  }
}
