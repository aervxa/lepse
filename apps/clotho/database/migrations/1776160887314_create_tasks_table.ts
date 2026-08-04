import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('description').nullable()
      table
        .enum('priority', ['none', 'low', 'medium', 'high', 'urgent'])
        .defaultTo('none')
        .notNullable()
      table
        .enum('status', ['todo', 'in_progress', 'done', 'canceled'])
        .defaultTo('todo')
        .notNullable()

      table.integer('pomo_count').defaultTo(0).notNullable()
      table.integer('stopwatch_ms').defaultTo(0).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
