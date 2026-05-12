import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'habits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.enum('frequency', ['daily', 'weekly']).notNullable().defaultTo('daily')
      table.integer('target').unsigned().notNullable().defaultTo(1)
      table.json('reminders').notNullable().defaultTo('[]')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
