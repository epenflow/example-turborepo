import { IdentifierContract } from '#models/compose/with_identifier'
import User from '#models/user'
import { BaseModelDto } from '@adocasts.com/dto/base'

export default class UserDto extends BaseModelDto {
  declare id: IdentifierContract
  declare firstName: string | null
  declare lastName: string | null
  declare username: string
  declare email: string
  // declare password: string
  declare dob: string | null
  declare age: number | null
  declare avatar: string | null
  declare fullName: string | null
  declare initialName: string
  declare createdAt: string
  declare updatedAt: string
  declare lastPasswordChangedAt: string | null

  constructor(user?: User) {
    super()

    if (!user) return
    this.id = user.id
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.username = user.username
    this.email = user.email
    // this.password = user.password
    this.dob = user.dob?.toISO() || null
    this.age = user.age
    this.avatar = user.avatar
    this.fullName = user.fullName
    this.initialName = user.initialName
    this.createdAt = user.createdAt.toISO()!
    this.updatedAt = user.updatedAt.toISO()!
    this.lastPasswordChangedAt = user.lastPasswordChangedAt?.toISO() || null
  }
}
