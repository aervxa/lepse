import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'
import drive from '@adonisjs/drive/services/main'

export default class UserTransformer extends BaseTransformer<User> {
  async toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'name',
        'email',
        'createdAt',
        'updatedAt',
        'initials',
        'backgroundId',
        'emailVerified',
      ]),
      avatarUrl: this.resource.avatar ? await drive.use().getUrl(this.resource.avatar) : null,
    }
  }
}
