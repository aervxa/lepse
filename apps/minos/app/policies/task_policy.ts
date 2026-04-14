import type User from '#models/user'
import type Task from '#models/task'
import { BasePolicy } from '@adonisjs/bouncer'

export default class TaskPolicy extends BasePolicy {
  /**
   * Only the task owner can delete their task
   */
  show(user: User, task: Task) {
    return task.userId === user.id
  }

  /**
   * Only the task owner can edit their task
   */
  edit(user: User, task: Task) {
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
  delete(user: User, task: Task) {
    return task.userId === user.id
  }
}
