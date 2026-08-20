import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'goal_task'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('task_id').unsigned().notNullable().references('tasks.id').onDelete('CASCADE')
      table.integer('goal_id').unsigned().notNullable().references('goals.id').onDelete('CASCADE')
      table.unique(['task_id', 'goal_id'])
    })

    // Move tasks.goal_id into goal_task.goal_id for the new many-to-many relation
    this.defer(async (db) => {
      const tasks = await db.from('tasks').whereNotNull('goal_id').select('id', 'goal_id')
      if (tasks.length) {
        await db.table('goal_task').insert(
          tasks.map((task) => ({
            task_id: task.id,
            goal_id: task.goal_id,
          }))
        )
      }
    })

    this.schema.alterTable('tasks', (table) => {
      table.dropForeign(['goal_id'])
      table.dropColumn('goal_id')
    })
  }

  async down() {
    this.schema.alterTable('tasks', (table) => {
      table.integer('goal_id').unsigned().nullable().references('goals.id').onDelete('SET NULL')
    })

    // Move goal_task.goal_id back into tasks.goal_id to undo the many-to-many relation
    this.defer(async (db) => {
      const tasks = await db.from('goal_task').select('task_id', 'goal_id')
      for (const task of tasks) {
        await db.from('tasks').where('id', task.task_id).update({ goal_id: task.goal_id })
      }
    })

    this.schema.dropTable(this.tableName)
  }
}
