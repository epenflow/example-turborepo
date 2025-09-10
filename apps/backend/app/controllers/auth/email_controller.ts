import { default as User } from '#models/user'
import env from '#start/env'
import { AuthValidator } from '#validators/index'
import { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'
import router from '@adonisjs/core/services/router'

export default class EmailController {
  async send({ request }: HttpContext) {
    const data = await request.validateUsing(AuthValidator.emailVerification)
    const user = await User.findByOrFail('email', data.email)

    if (user) {
      const { token, expiresAt } = await User.createEmailVerificationToken(user)

      const link = router
        .builder()
        .disableRouteLookup()
        .prefixUrl(env.get('APP_BASE_URL'))
        .qs({ token, expiresAt: expiresAt.toISO() })
        .make('email-verification')

      emitter.emit('user:email', {
        user,
        link,
        type: 'request',
        expiresAt: `${expiresAt.toRelative()}`,
      })
    }

    return {
      message: 'If a user with that email exists, a email verification link has been sent.',
    }
  }

  async confirm({ request }: HttpContext) {
    const token = request.header('X-Email-Verification-Token')

    if (token) {
      const user = await User.verifyEmail(token)
      const link = router
        .builder()
        .disableRouteLookup()
        .prefixUrl(env.get('APP_BASE_URL'))
        .make('sign-in')

      emitter.emit('user:email', {
        type: 'confirm',
        user,
        link,
      })
    }

    return {
      message: 'Your email has been verify',
    }
  }
}
