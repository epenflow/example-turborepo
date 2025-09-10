import { RuntimeException } from '@adonisjs/core/exceptions'
import string from '@adonisjs/core/helpers/string'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'
import { inspect } from 'node:util'

type DbTokensProviderOptions = {
  table?: string
  expiresIn?: DateTime<boolean>
}

type DbTokensColumn<TokenType> = {
  tokenable_id: string | number | BigInt
  type: TokenType
  token: string
  created_at: DateTime<boolean>
  updated_at: DateTime<boolean>
  expires_at: DateTime<boolean>
}

export default class DbTokensProvider<TokenableModel extends LucidModel, TokenType> {
  static forModel<TokenableModel extends LucidModel, TokenType>(
    model: TokenableModel,
    options?: DbTokensProviderOptions
  ) {
    return new DbTokensProvider<TokenableModel, TokenType>(model, options || {})
  }

  protected table: string

  protected async getDb() {
    return this.model.query(this.model).client
  }

  constructor(
    protected model: TokenableModel,
    protected options: DbTokensProviderOptions
  ) {
    this.table = options.table || 'tokens'
  }

  #ensureIsPersisted(user: InstanceType<TokenableModel>) {
    const model = this.model
    if (user instanceof model === false) {
      throw new RuntimeException(
        `Invalid user object. It must be an instance of the "${model.name}" model`
      )
    }

    if (!user.$primaryKeyValue) {
      throw new RuntimeException(
        `Cannot use "${model.name}" model for managing ${this.table}. The value of column "${model.primaryKey}" is undefined or null`
      )
    }
  }

  #isObject(value: unknown) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }

  protected dbRowToToken(dbRow: DbTokensColumn<TokenType> & { id: string | number | BigInt }): {
    id: string | number | BigInt
    tokenableId: string | number | BigInt
    type: TokenType
    token: string
    createdAt: DateTime<boolean>
    updatedAt: DateTime<boolean>
    expiresAt: DateTime<boolean>
  } {
    return {
      id: dbRow.id,
      tokenableId: dbRow.tokenable_id,
      type: dbRow.type,
      token: dbRow.token,
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at,
      expiresAt: dbRow.expires_at,
    }
  }

  async create(user: InstanceType<TokenableModel>, type: TokenType) {
    this.#ensureIsPersisted(user)

    const queryClient = await this.getDb()

    const dbRow: DbTokensColumn<TokenType> = {
      tokenable_id: user.$primaryKeyValue!,
      created_at: DateTime.now(),
      updated_at: DateTime.now(),
      token: string.random(32),
      type: type,
      expires_at: this.options.expiresIn || DateTime.utc().plus({ hour: 1 }),
    }

    const result = await queryClient.table(this.table).insert(dbRow).returning('id')
    const id = this.#isObject(result[0]) ? result[0].id : result[0]

    if (!id) {
      throw new RuntimeException(
        `Cannot save token. The result "${inspect(result)}" of insert query is unexpected`
      )
    }

    return {
      token: dbRow.token,
      expiresAt: dbRow.expires_at,
    }
  }

  async verify(token: string, type: TokenType) {
    const db = await this.getDb()
    const dbRow = await db.query().from(this.table).where({ token, type }).first()

    if (!dbRow) return null

    if (DateTime.fromSQL(dbRow.expires_at, { zone: 'utc' }) <= DateTime.utc()) return null

    return {
      isExpires: false,
      row: this.dbRowToToken(dbRow),
    }
  }

  async invalidated(token: string) {
    const db = await this.getDb()

    const count = await db.query().from(this.table).where({ token: token }).del().exec()

    return Boolean(count)
  }

  async clearTokens(user: InstanceType<TokenableModel>) {
    this.#ensureIsPersisted(user)

    const db = await this.getDb()

    const count = db
      .query()
      .from(this.table)
      .where('tokenable_id', user.$primaryKeyValue!)
      .del()
      .exec()

    return Boolean(count)
  }

  async all(user: InstanceType<TokenableModel>) {
    this.#ensureIsPersisted(user)

    const db = await this.getDb()
    const dbRow = await db
      .query()
      .from(this.table)
      .where({ tokenable_id: user.$primaryKeyValue! })
      .orderBy('id', 'desc')
      .exec()

    return dbRow.map((row) => this.dbRowToToken(row))
  }
}
