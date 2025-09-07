import { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export type IdentifierContract = string | number

export default function <T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) {
  class BaseClass extends superclass {
    @column({ isPrimary: true })
    declare id: IdentifierContract
  }

  return BaseClass
}
