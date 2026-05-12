import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'journals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.date('date').notNullable()
      table.text('body').nullable()
      table.integer('mood').checkBetween([1, 5]).nullable()

      table.unique(['user_id', 'date'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
