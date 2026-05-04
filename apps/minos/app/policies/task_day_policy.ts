import type User from '#models/user'
import type Task from '#models/task'
import type TaskDay from '#models/task_day'
import { BasePolicy } from '@adonisjs/bouncer'

export default class TaskDayPolicy extends BasePolicy {
  /**
   * Only the task owner can create the day task
   */
  store(user: User, task: Task) {
    return task.userId === user.id
  }
  /**
   * Only the task owner can delete the day task
   */
  delete(user: User, dayTask: TaskDay) {
    return dayTask.userId === user.id
  }
}
