import type User from '#models/user'
import type Task from '#models/task'
import { BasePolicy } from '@adonisjs/bouncer'
import Goal from '#models/goal'

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

  attachGoal(user: User, task: Task, goal: Goal) {
    return task.userId === user.id && goal.userId === user.id
  }
  detachGoal(user: User, task: Task, goal: Goal) {
    return task.userId === user.id && goal.userId === user.id
  }
}
