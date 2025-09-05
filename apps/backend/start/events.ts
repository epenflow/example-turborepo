import SendResetPasswordNotification from '#mails/send_reset_password_notification'
import SendResetPasswordRequestNotification from '#mails/send_reset_password_request_notification'
import User from '#models/user'
import emitter from '@adonisjs/core/services/emitter'
import mail from '@adonisjs/mail/services/main'

emitter.on('user:request-reset-password', async (event) => {
  await mail.send(new SendResetPasswordRequestNotification(event.user, event.resetLink))
})
emitter.on('user:reset-password', async (event) => {
  await mail.send(new SendResetPasswordNotification(event))
})

declare module '@adonisjs/core/types' {
  interface EventsList {
    'user:request-reset-password': {
      user: User
      resetLink: string
    }
    'user:reset-password': User
  }
}
