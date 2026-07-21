import { TaskSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import TaskDay from './task_day.ts'

export default class Task extends TaskSchema {
  /**
   * A task has many task days
   */
  @hasMany(() => TaskDay)
  declare taskDays: HasMany<typeof TaskDay>
}
