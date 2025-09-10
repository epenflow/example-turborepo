import SendEmailVerificationNotification, {
  type Options as EmailEventOptions,
} from '#mails/send_email_verification_notification'
import SendPasswordResetNotification, {
  type Options as PasswordEventOptions,
} from '#mails/send_password_notification'
import emitter from '@adonisjs/core/services/emitter'
import mail from '@adonisjs/mail/services/main'

emitter.on('user:email', async (event) => {
  await mail.send(new SendEmailVerificationNotification(event))
})
emitter.on('user:password', async (event) => {
  await mail.send(new SendPasswordResetNotification(event))
})

declare module '@adonisjs/core/types' {
  interface EventsList {
    'user:password': PasswordEventOptions
    'user:email': EmailEventOptions
  }
}
