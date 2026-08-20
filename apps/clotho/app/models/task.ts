import { TaskSchema } from '#database/schema'
import { hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Goal from './goal.ts'
import TaskDay from './task_day.ts'

export default class Task extends TaskSchema {
  /**
   * A task has many task days
   */
  @hasMany(() => TaskDay)
  declare taskDays: HasMany<typeof TaskDay>

  @manyToMany(() => Goal)
  declare goals: ManyToMany<typeof Goal>
}
