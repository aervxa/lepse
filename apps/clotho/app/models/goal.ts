import { GoalSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import { type ManyToMany } from '@adonisjs/lucid/types/relations'
import Task from './task.ts'

export default class Goal extends GoalSchema {
  @manyToMany(() => Task)
  declare tasks: ManyToMany<typeof Task>
}
