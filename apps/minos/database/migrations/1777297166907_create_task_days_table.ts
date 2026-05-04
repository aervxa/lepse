import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'task_days'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.integer('task_id').unsigned().nullable().references('tasks.id').onDelete('SET NULL')
      table.date('date').notNullable()
      table.string('status').notNullable()

      table.unique(['task_id', 'date'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
