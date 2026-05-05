import type User from '#models/user'
import type Task from '#models/task'
import { BasePolicy } from '@adonisjs/bouncer'

export default class TaskPolicy extends BasePolicy {
  /**
   * Only the task owner can view their task
   */
  show(user: User, task: Task) {
    return task.userId === user.id
  }

  /**
   * Only the task owner can update their task
   */
  update(user: User, task: Task) {
    return task.userId === user.id
  }

  /**
   * Only the task owner can delete their task
   */
  destroy(user: User, task: Task) {
    return task.userId === user.id
  }
}
