import AccessTokenDto from '#dtos/access_token'
import UserDto from '#dtos/user'
import User from '#models/user'
import { AuthValidator, UserValidator } from '#validators/index'
import { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async signIn({ request, auth }: HttpContext) {
    const data = await request.validateUsing(AuthValidator.signIn)
    const currentUser = await User.verifyCredentials(data.email, data.password)

    const accessToken = await auth.use('api').createToken(currentUser)

    return {
      accessToken: new AccessTokenDto(accessToken),
      currentUser: new UserDto(currentUser),
    }
  }

  async signUp({ request }: HttpContext) {
    const { avatar, ...data } = await request.validateUsing(UserValidator.createUser)

    const user = await User.create(data)

    return {
      message: 'Account created successfully.',
      user: new UserDto(user),
    }
  }

  async me({ auth }: HttpContext) {
    const currentUser = auth.getUserOrFail()

    return {
      currentUser: new UserDto(currentUser),
    }
  }

  async signOut({ auth }: HttpContext) {
    await auth.use('api').invalidateToken()

    return {
      message: 'Sign out successfully.',
    }
  }
}
