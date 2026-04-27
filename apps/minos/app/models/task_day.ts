import { TaskDaySchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Task from './task.ts'

export default class TaskDay extends TaskDaySchema {
  /**
   * A task day belongs to a task
   */
  @belongsTo(() => Task)
  declare task: BelongsTo<typeof Task>
}
