import type User from '#models/user'
import type Scribble from '#models/scribble'
import { BasePolicy } from '@adonisjs/bouncer'

export default class ScribblePolicy extends BasePolicy {
  /**
   * Only the scribble owner can view their scribble
   */
  show(user: User, scribble: Scribble) {
    return scribble.userId === user.id
  }

  /**
   * Only the scribble owner can update their scribble
   */
  update(user: User, scribble: Scribble) {
    return scribble.userId === user.id
  }

  /**
   * Only the scribble owner can destroy their scribble
   */
  destroy(user: User, scribble: Scribble) {
    return scribble.userId === user.id
  }
}
