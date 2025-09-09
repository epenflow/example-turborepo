import { default as User } from '#models/user'
import env from '#start/env'
import { AuthValidator } from '#validators/index'
import { HttpContext } from '@adonisjs/core/http'
import emitter from '@adonisjs/core/services/emitter'
import router from '@adonisjs/core/services/router'
import { DateTime } from 'luxon'

export default class EmailController {
  async send({ request }: HttpContext) {
    const data = await request.validateUsing(AuthValidator.emailVerification)
    const user = await User.findByOrFail('email', data.email)

    if (user) {
      const { token, expiresAt } = await User.createEmailVerificationToken(user)
      const expiresIn = DateTime.fromJSDate(expiresAt, { zone: 'utc' })

      const link = router
        .builder()
        .disableRouteLookup()
        .prefixUrl(env.get('APP_BASE_URL'))
        .qs({ token, expiresAt: expiresIn.toISO() })
        .make('email-verification')

      emitter.emit('user:email-verification-request', {
        user,
        link,
        expiresAt: `${expiresIn.toISO()}`,
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

      emitter.emit('user:email-verification-confirm', { user, link })
    }

    return {
      message: 'Your email has been verify',
    }
  }
}
