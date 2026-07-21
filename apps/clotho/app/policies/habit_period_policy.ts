import type User from '#models/user'
import type Habit from '#models/habit'
import { BasePolicy } from '@adonisjs/bouncer'

export default class HabitPeriodPolicy extends BasePolicy {
  /**
   * Only the habit owner can update their habit period
   */
  update(user: User, habit: Habit) {
    return habit.userId === user.id
  }

  /**
   * Only the habit owner can view their habit period
   */
  show(user: User, habit: Habit) {
    return habit.userId === user.id
  }
}
