import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.enum('urgency', ['none', 'low', 'medium', 'high']).defaultTo('none')
      table.enum('status', ['todo', 'in_progress', 'complete']).defaultTo('todo')
      table.integer('time_estimate_min').nullable()
      table.timestamp('deadline').nullable()

      table.integer('pomo_count').defaultTo(0)
      table.integer('stopwatch_ms').defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
