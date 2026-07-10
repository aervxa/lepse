import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'backgrounds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('key').notNullable().unique()
      table.string('name').notNullable()
      table.string('style').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
