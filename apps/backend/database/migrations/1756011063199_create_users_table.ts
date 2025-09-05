import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected readonly tableNames = {
    users: 'users',
    authAccessTokens: 'auth_access_tokens',
    resetPasswordTokens: 'reset_password_tokens',
  }

  async up() {
    this.schema.createTable(this.tableNames.users, (table) => {
      table.increments('id').notNullable()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('username').unique().notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.timestamp('dob').nullable()
      table.string('avatar').nullable()
    })

    this.schema.createTable(this.tableNames.authAccessTokens, (table) => {
      table.increments('id')
      table
        .integer('tokenable_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable(this.tableNames.users)
        .onDelete('CASCADE')

      table.string('type').notNullable()
      table.string('name').nullable()
      table.string('hash').notNullable()
      table.text('abilities').notNullable()

      table.timestamp('last_used_at').nullable()
      table.timestamp('expires_at').nullable()
    })

    this.schema.createTable(this.tableNames.resetPasswordTokens, (table) => {
      table.increments('id')
      table
        .integer('tokenable_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable(this.tableNames.users)

        .onDelete('CASCADE')
      table.string('value', 255).notNullable()
      table.timestamp('expires_at').notNullable()
    })

    Object.entries(this.tableNames).forEach(([_, tableName]) => {
      this.schema.alterTable(tableName, (table) => {
        table.timestamp('created_at').notNullable()
        table.timestamp('updated_at').notNullable()
      })
    })
  }

  async down() {
    Object.entries(this.tableNames).forEach(([_, tableName]) => {
      this.schema.alterTable(tableName, (table) => {
        table.dropColumn('created_at')
        table.dropColumn('updated_at')
      })
    })

    this.schema.dropTable(this.tableNames.authAccessTokens)
    this.schema.dropTable(this.tableNames.resetPasswordTokens)
    this.schema.dropTable(this.tableNames.users)
  }
}
