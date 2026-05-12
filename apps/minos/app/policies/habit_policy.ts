import type User from '#models/user'
import type Habit from '#models/habit'
import { BasePolicy } from '@adonisjs/bouncer'

export default class HabitPolicy extends BasePolicy {
  /**
   * Only the habit owner can view their habit
   */
  show(user: User, habit: Habit) {
    return habit.userId === user.id
  }

  /**
   * Only the habit owner can update their habit
   */
  update(user: User, habit: Habit) {
    return habit.userId === user.id
  }

  /**
   * Only the habit owner can delete their habit
   */
  destroy(user: User, habit: Habit) {
    return habit.userId === user.id
  }
}
