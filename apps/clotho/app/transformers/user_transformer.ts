import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

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
        'emailVerified',
      ]),
      avatarUrl: await this.resource.getAvatarUrl(),
    }
  }

  async toPublic() {
    return {
      ...this.pick(this.resource, ['id', 'name', 'initials']),
      avatarUrl: await this.resource.getAvatarUrl(),
    }
  }
}
