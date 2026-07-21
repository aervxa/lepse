import type User from '#models/user'
import type Goal from '#models/goal'
import { BasePolicy } from '@adonisjs/bouncer'

export default class GoalPolicy extends BasePolicy {
  /**
   * Only the goal owner can view their goal
   */
  show(user: User, goal: Goal) {
    return goal.userId === user.id
  }

  /**
   * Only the goal owner can update their goal
   */
  update(user: User, goal: Goal) {
    return goal.userId === user.id
  }

  /**
   * Only the goal owner can destroy their goal
   */
  destroy(user: User, goal: Goal) {
    return goal.userId === user.id
  }
}
