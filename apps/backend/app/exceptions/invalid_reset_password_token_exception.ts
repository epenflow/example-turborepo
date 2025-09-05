import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class InvalidResetPasswordTokenException extends Exception {
  static status = 403
  static code?: string | undefined = 'E_INVALID_RESET_PASSWORD_TOKEN'
  static message?: string | undefined = 'The reset password token provided is invalid or expired'

  async handle(error: this, ctx: HttpContext) {
    switch (ctx.request.accepts(['html', 'application/vnd.api+json', 'json'])) {
      case 'json':
        ctx.response.status(error.status).send({
          errors: [
            {
              message: error.message,
            },
          ],
        })
        break
      case 'application/vnd.api+json':
        ctx.response.status(error.status).send({
          errors: [
            {
              code: error.code,
              title: error.message,
            },
          ],
        })
    }
  }
}
