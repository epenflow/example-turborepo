import SendEmailVerificationNotification from '#mails/send_email_verification_notification'
import SendPasswordResetNotification from '#mails/send_password_notification'
import User from '#models/user'
import emitter from '@adonisjs/core/services/emitter'
import mail from '@adonisjs/mail/services/main'

emitter.on('user:reset-password-request', async (event) => {
  await mail.send(new SendPasswordResetNotification({ ...event, type: 'request' }))
})
emitter.on('user:reset-password-confirm', async (event) => {
  await mail.send(new SendPasswordResetNotification({ user: event, type: 'confirm' }))
})

emitter.on('user:email-verification-request', async (event) => {
  await mail.send(new SendEmailVerificationNotification({ ...event, type: 'request' }))
})
emitter.on('user:email-verification-confirm', async (event) => {
  await mail.send(new SendEmailVerificationNotification({ ...event, type: 'confirm' }))
})

declare module '@adonisjs/core/types' {
  interface EventsList {
    'user:reset-password-request': {
      user: User
      link: string
      expiresAt: string
    }
    'user:reset-password-confirm': User
    'user:email-verification-request': {
      user: User
      link: string
      expiresAt: string
    }
    'user:email-verification-confirm': {
      user: User
      link: string
    }
  }
}
