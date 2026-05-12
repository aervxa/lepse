import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'habit_periods'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.integer('habit_id').unsigned().notNullable().references('habits.id').onDelete('CASCADE')
      table.date('start').notNullable()
      table.date('end').notNullable()
      table.integer('count').unsigned().notNullable().defaultTo(0)
      table.boolean('completed').notNullable().defaultTo(false)

      table.unique(['habit_id', 'start', 'end'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
