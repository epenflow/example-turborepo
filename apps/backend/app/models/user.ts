import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { attachment } from '@jrmc/adonis-attachment'
import { type Attachment } from '@jrmc/adonis-attachment/types/attachment'
import { DateTime } from 'luxon'
import WithIdentifier from './compose/with_identifier.js'
import WithTimestamp from './compose/with_timestamp.js'
import { WithUserAuth, WithUserComputed, WithUserCredentials } from './compose/with_user.js'

export default class User extends compose(
  BaseModel,
  WithIdentifier,
  WithTimestamp,
  WithUserCredentials,
  WithUserComputed,
  WithUserAuth
) {
  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column.dateTime()
  declare dob: DateTime | null

  @attachment()
  declare avatar: Attachment | null

  // static async saveAvatarToDisk(file?: MultipartFile) {
  //   if (file) {
  //     const fileName = `${cuid()}.${file.extname}`
  //     await file.move(app.publicPath('uploads'), {
  //       name: fileName,
  //     })

  //     return fileName
  //   }
  //   return null
  // }

  // async withAvatarMergeAndSave(
  //   this: User,
  //   data: Partial<Omit<ModelAttributes<User>, 'avatar'> & { avatar?: MultipartFile }>
  // ) {
  //   const { avatar: file, ...rest } = data
  //   if (file) {
  //     if (this.avatar) {
  //       await fs.unlink(app.publicPath('uploads', this.avatar))
  //     }
  //     const avatar = await User.saveAvatarToDisk(data.avatar)
  //     this.merge({ avatar, ...rest })
  //   } else {
  //     this.merge({ ...rest })
  //   }

  //   this.save()
  // }
}
