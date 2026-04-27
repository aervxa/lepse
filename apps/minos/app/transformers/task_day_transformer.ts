import { BaseTransformer } from '@adonisjs/core/transformers'
import type TaskDay from '#models/task_day'

export default class TaskDayTransformer extends BaseTransformer<TaskDay> {
  toObject() {
    return this.pick(this.resource, ['id', 'taskId', 'date', 'status'])
  }
}
