import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { compose, cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, computed, hasMany } from '@adonisjs/lucid/orm'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import { type HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import fs from 'node:fs/promises'
import WithIdentifier from './compose/with_identifier.js'
import WithTimestamp from './compose/with_timestamp.js'
import ResetPasswordToken from './reset_password_token.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, WithIdentifier, WithTimestamp) {
  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  static accessTokens = DbAccessTokensProvider.forModel(User)

  static currentAccessToken?: AccessToken

  @hasMany(() => ResetPasswordToken)
  declare resetPasswordTokens: HasMany<typeof ResetPasswordToken>

  @column.dateTime()
  declare dob: DateTime | null

  @column()
  declare avatar: string | null

  @computed()
  get fullName() {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim()
  }

  @computed()
  get initialName() {
    const names = this.fullName.split(' ').filter(Boolean)

    if (names.length === 0) return this.username.charAt(0).toUpperCase()
    if (names.length === 1) return names[0].charAt(0).toUpperCase()

    const firstInitial = names[0].charAt(0)
    const lastInitial = names[names.length - 1].charAt(0)

    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  static async saveAvatarToDisk(file?: MultipartFile) {
    if (file) {
      const fileName = `${cuid()}.${file.extname}`
      await file.move(app.publicPath('uploads'), {
        name: fileName,
      })

      return fileName
    }
    return null
  }

  async withAvatarMergeAndSave(
    this: User,
    data: Partial<Omit<ModelAttributes<User>, 'avatar'> & { avatar?: MultipartFile }>
  ) {
    const { avatar: file, ...rest } = data
    if (file) {
      if (this.avatar) {
        await fs.unlink(app.publicPath('uploads', this.avatar))
      }
      const avatar = await User.saveAvatarToDisk(data.avatar)
      this.merge({ avatar, ...rest })
    } else {
      this.merge({ ...rest })
    }

    this.save()
  }
}
