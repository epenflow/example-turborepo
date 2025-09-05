import UserDto from '#dtos/user'
import { default as User } from '#models/user'
import { UserValidator } from '#validators/index'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const users = await User.query().whereNot('id', user.id)

    return {
      users: UserDto.fromArray(users),
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const data = await request.validateUsing(UserValidator.createUser)

    const avatar = await User.saveAvatarToDisk(data.avatar)

    const user = await User.create({ ...data, avatar })

    return {
      message: 'user created successfully',
      user: new UserDto(user),
    }
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    const user = await User.findByOrFail('id', params.id)

    return {
      user: new UserDto(user),
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const user = await User.findByOrFail('id', params.id)

    const data = await request.validateUsing(UserValidator.updateUser, {
      meta: {
        id: user.id,
      },
    })

    await user.withAvatarMergeAndSave(data)

    return {
      message: `user updated successfully`,
      user: new UserDto(user),
    }
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const user = await User.findByOrFail('id', params.id)

    await user.delete()

    return {
      message: 'user deleted successfully',
    }
  }
}
