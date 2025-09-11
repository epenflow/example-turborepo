import UserDto from '#dtos/user'
import { UserValidator } from '#validators/index'
import { errors as authErrors } from '@adonisjs/auth'
import { HttpContext } from '@adonisjs/core/http'
import { attachmentManager } from '@jrmc/adonis-attachment'

export default class AccountController {
  async destroy({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(UserValidator.destroyUser)

    if (!(await user.verifyPassword(data.password))) {
      throw new authErrors.E_INVALID_CREDENTIALS('Invalid user credentials')
    }

    await user.delete()

    return {
      message: 'Account deleted successfully.',
    }
  }

  async update({ request, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const { avatar, ...data } = await request.validateUsing(UserValidator.updateUser, {
      meta: {
        id: user.id,
      },
    })

    if (avatar) {
      user.avatar = await attachmentManager.createFromFile(avatar)
    }

    await user.merge(data).save()

    return {
      message: 'Profile updated successfully.',
      currentUser: new UserDto(user),
    }
  }
}
