import ResetPasswordToken from '#models/reset_password_token'
import User from '#models/user'
import env from '#start/env'
import { AuthValidator } from '#validators/index'
import { errors as authErrors } from '@adonisjs/auth'
import { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'
import router from '@adonisjs/core/services/router'

export default class PasswordController {
  async forgot({ request }: HttpContext) {
    const data = await request.validateUsing(AuthValidator.forgotPassword)
    const user = await User.findBy('email', data.email)

    if (user) {
      const resetToken = await ResetPasswordToken.generate(user)

      const resetLink = router
        .builder()
        .disableRouteLookup()
        .prefixUrl(env.get('APP_BASE_URL'))
        .qs({
          token: resetToken.token,
          expiresAt: resetToken.expiresAt.toISO(),
        })
        .make('reset-password')

      emitter.emit('user:request-reset-password', {
        user,
        resetLink,
      })
    }

    return {
      message: 'If a user with that email exists, a password reset link has been sent.',
    }
  }

  async reset({ request }: HttpContext) {
    const token = request.header('X-Password-Reset-Token')

    if (token) {
      const data = await request.validateUsing(AuthValidator.resetPassword)
      const user = await ResetPasswordToken.reset(token, data.new)

      emitter.emit('user:reset-password', user)
    }
    return {
      message: 'Your password has been reset successfully.',
    }
  }

  async change({ request, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const data = await request.validateUsing(AuthValidator.changePassword)

    if (!(await user.verifyPassword(data.current))) {
      throw new authErrors.E_INVALID_CREDENTIALS('Invalid user credentials')
    }

    await user.merge({ password: data.new }).save()

    return {
      message: 'Password changed successfully.',
    }
  }
}
