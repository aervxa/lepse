import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('deadline')
      table.dropColumn('time_estimate_min')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('time_estimate_min').nullable()
      table.timestamp('deadline').nullable()
    })
  }
}
