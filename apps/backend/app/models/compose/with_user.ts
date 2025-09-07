import ResetPasswordToken from '#models/reset_password_token'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { BaseModel, computed, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

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
  }

  return BaseClass
}
export const WithUserAuth = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export function WithUserRelations<T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) {
  class BaseClass extends superclass {
    @hasMany(() => ResetPasswordToken)
    declare resetPasswordTokens: HasMany<typeof ResetPasswordToken>
  }

  return BaseClass
}
