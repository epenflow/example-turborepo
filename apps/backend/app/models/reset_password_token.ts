import InvalidResetPasswordTokenException from '#exceptions/invalid_reset_password_token_exception'
import { compose } from '@adonisjs/core/helpers'
import stringHelpers from '@adonisjs/core/helpers/string'
import encryption from '@adonisjs/core/services/encryption'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import type { IdentifierContract } from './compose/with_identifier.js'
import WithTimestamp from './compose/with_timestamp.js'
import User from './user.js'

export default class ResetPasswordToken extends compose(BaseModel, WithTimestamp) {
  static validFor = { hour: 1 }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tokenableId: IdentifierContract

  @column()
  declare value: string

  @column.dateTime()
  declare expiresAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'tokenableId',
  })
  declare user: BelongsTo<typeof User>

  get isValid() {
    return this.expiresAt > DateTime.now()
  }

  static async generate(user: User) {
    const value = stringHelpers.random(32)
    const expiresAt = DateTime.now().plus(this.validFor)
    const token = encryption.encrypt(value)

    await ResetPasswordToken.create({
      tokenableId: user.id,
      value: value,
      expiresAt,
    })

    return { token, expiresAt }
  }

  static async verify(encryptedValue: string) {
    const value = encryption.decrypt(encryptedValue)
    const resetPasswordToken = await this.query()
      .where({ value: value })
      .andWhere('expiresAt', '>=', DateTime.now().toSQL())
      .first()
    const user = await resetPasswordToken?.related('user').query().first()

    return {
      isValid: resetPasswordToken?.isValid,
      resetPasswordToken,
      user,
    }
  }

  static async reset(encryptedValue: string, password: string) {
    const { isValid, user } = await this.verify(encryptedValue)

    if (!isValid || !user) {
      throw new InvalidResetPasswordTokenException()
    }

    await user.merge({ password }).save()
    await this.expiresForAllUser(user)

    return user
  }

  static async expiresForAllUser(user: User) {
    await ResetPasswordToken.query()
      .where('tokenableId', user.id)
      .where('expiresAt', '>=', DateTime.now().toSQL({ includeOffset: false }))
      .update({
        expiresAt: DateTime.now().toSQL({ includeOffset: false }),
        updatedAt: DateTime.now().toSQL({ includeOffset: false }),
      })
  }
}
