import { BaseDto } from '@adocasts.com/dto/base'
import { AccessToken } from '@adonisjs/auth/access_tokens'

export default class AccessTokenDto extends BaseDto {
  declare type: string
  declare name: string | null
  declare token: string | undefined
  declare abilities: string[]
  declare lastUsedAt: string | null
  declare expiresAt: string | null

  constructor(accessToken?: AccessToken) {
    super()

    if (!accessToken) return
    this.type = accessToken.type
    this.name = accessToken.name
    this.token = accessToken.value ? accessToken.value.release() : accessToken.value
    this.abilities = accessToken.abilities
    this.lastUsedAt = accessToken.lastUsedAt?.toISOString()!
    this.expiresAt = accessToken.expiresAt?.toISOString()!
  }
}
