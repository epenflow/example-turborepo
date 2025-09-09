import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class TokenProvider {
  protected id = 1

  protected user() {
    return User.findByOrFail('id', this.id)
  }

  async create({ response }: HttpContext) {
    const user = await this.user()
    const password = await User.tokens.create(user, 'reset_password')
    const email = await User.tokens.create(user, 'email_verification')

    return response.ok({ password, email })
  }

  async verify({ response, params }: HttpContext) {
    console.log({ params })
    const token = await User.tokens.verify(params.token, params.type)

    return response.ok({ token })
  }

  async invalidated({ params, response }: HttpContext) {
    const count = await User.tokens.invalidated(params.token)

    return response.ok({ count })
  }

  async clearTokens({ response }: HttpContext) {
    const user = await this.user()
    const count = await User.tokens.clearTokens(user)

    return response.ok({ count })
  }

  async all({ response }: HttpContext) {
    const user = await this.user()
    const tokens = await User.tokens.all(user)

    return response.ok({ tokens })
  }
}
