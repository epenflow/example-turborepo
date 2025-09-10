import InvalidTokenException from '#exceptions/invalid_token_exception'
import DbTokensProvider from '#models/db_token_provider'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { BaseModel, beforeUpdate, column, computed } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export function WithUserComputed<T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) {
  class BaseClass extends superclass {
    @computed()
    get fullName(): string | null {
      const firstName: string | null = (this as any)['firstName']
      const lastName: string | null = (this as any)['lastName']

      if (!firstName && !lastName) return null

      const $fullName = `${firstName || ''} ${lastName || ''}`.trim()

      return $fullName.length > 0 ? $fullName : null
    }

    @computed()
    get initialName(): string {
      const defaultInitial = ((this as any)['username'] as string).charAt(0).toUpperCase()

      if (!this.fullName) return defaultInitial

      const names = this.fullName.split(' ').filter(Boolean)

      if (names.length === 0) return defaultInitial
      if (names.length === 1) return names[0].charAt(0).toUpperCase()

      const firstInitial = names[0].charAt(0)
      const lastInitial = names[names.length - 1].charAt(0)

      return `${firstInitial}${lastInitial}`.toUpperCase()
    }

    @computed()
    get age(): number | null {
      const dob: DateTime<boolean> | null = (this as any)['dob']

      if (!dob) return null

      const age = DateTime.now().diff(dob, ['years', 'months', 'days']).toObject()

      return age.years || null
    }
  }

  return BaseClass
}
export const WithUserAuth = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

type WithUserCredentialsColumn = {
  username: string
  email: string
  password: string
  lastPasswordChangedAt: DateTime<boolean> | null
  emailVerifiedAt: DateTime<boolean> | null
  isEmailVerified: boolean
}

type WithUserCredentialsClass<
  Model extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = Model & {
  new (...args: any[]): WithUserCredentialsColumn
  accessTokens: DbAccessTokensProvider<Model>
  currentAccessToken?: AccessToken
  tokens: DbTokensProvider<Model, 'reset_password' | 'email_verification'>
  resetPassword<T extends WithUserCredentialsClass>(
    this: T,
    token: string,
    password: string
  ): Promise<InstanceType<T>>
  createResetPasswordToken(
    user: InstanceType<Model>
  ): Promise<{ token: string; expiresAt: DateTime<boolean> }>
  createEmailVerificationToken(
    user: InstanceType<Model>
  ): Promise<{ token: string; expiresAt: DateTime<boolean> }>
  updateLastPasswordChangedAt(user: InstanceType<Model>): void
  createEmailVerificationToken(
    user: InstanceType<Model>
  ): Promise<{ token: string; expiresAt: DateTime<boolean> }>
  verifyEmail<T extends WithUserCredentialsClass>(this: T, token: string): Promise<InstanceType<T>>
  verifyToken<T extends WithUserCredentialsClass>(
    this: T,
    token: string,
    type: 'reset_password' | 'email_verification'
  ): Promise<InstanceType<T>>
}

export function WithUserCredentials<Model extends NormalizeConstructor<typeof BaseModel>>(
  superclass: Model
): WithUserCredentialsClass<Model> {
  class BaseClass extends superclass {
    @column()
    declare username: string

    @column()
    declare email: string

    @column({ serializeAs: null })
    declare password: string

    @column.dateTime()
    declare lastPasswordChangedAt: DateTime | null

    @column.dateTime()
    declare emailVerifiedAt: DateTime | null

    @computed()
    get isEmailVerified(): boolean {
      if (this.emailVerifiedAt) return true
      return false
    }

    static accessTokens = DbAccessTokensProvider.forModel(BaseClass)

    static currentAccessToken?: AccessToken

    static tokens = DbTokensProvider.forModel<
      typeof BaseClass,
      'reset_password' | 'email_verification'
    >(BaseClass, {
      table: 'user_tokens',
      expiresIn: DateTime.now().plus({ hour: 2 }),
    })

    @beforeUpdate()
    static async updateLastPasswordChangedAt(user: InstanceType<typeof BaseClass>) {
      if (user.$dirty.password) {
        user.lastPasswordChangedAt = DateTime.now()
      }
    }

    static async createResetPasswordToken(user: InstanceType<typeof BaseClass>) {
      await this.tokens.clearTokens(user)

      return this.tokens.create(user, 'reset_password')
    }
    static async createEmailVerificationToken(user: InstanceType<typeof BaseClass>) {
      await this.tokens.clearTokens(user)

      return this.tokens.create(user, 'email_verification')
    }

    static async resetPassword<This extends WithUserCredentialsClass>(
      this: This,
      token: string,
      password: string
    ) {
      const user = await this.verifyToken(token, 'reset_password')

      user.password = password
      await user.save()

      await this.tokens.invalidated(token)

      return user
    }

    static async verifyEmail<This extends WithUserCredentialsClass>(this: This, token: string) {
      const user = await this.verifyToken(token, 'email_verification')

      user.emailVerifiedAt = DateTime.now()

      await user.save()

      await this.tokens.invalidated(token)

      return user
    }

    static async verifyToken<This extends WithUserCredentialsClass>(
      this: This,
      token: string,
      type: 'reset_password' | 'email_verification'
    ) {
      const verifiedToken = await this.tokens.verify(token, type)

      if (!verifiedToken || verifiedToken.isExpires) {
        throw new InvalidTokenException()
      }

      const user = this.query().where({ id: verifiedToken.row.tokenableId }).firstOrFail()

      return user
    }
  }

  return BaseClass
}
