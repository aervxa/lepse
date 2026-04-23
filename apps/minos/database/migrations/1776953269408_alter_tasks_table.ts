import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('goal_id').unsigned().nullable()
      table.foreign('goal_id').references('goals.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['goal_id'])
      table.dropColumn('goal_id')
    })
  }
}
