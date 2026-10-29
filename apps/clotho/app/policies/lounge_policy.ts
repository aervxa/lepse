import type User from '#models/user'
import type Lounge from '#models/lounge'
import { BasePolicy } from '@adonisjs/bouncer'

export default class LoungePolicy extends BasePolicy {
  /**
   * Only the host can delete the lounge
   */
  destroy(user: User, lounge: Lounge) {
    return lounge.userId === user.id
  }
}
