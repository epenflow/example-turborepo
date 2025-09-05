import User from '#models/user'
import app from '@adonisjs/core/services/app'
import { BaseMail } from '@adonisjs/mail'

export default class SendResetPasswordNotification extends BaseMail {
  // from = ''
  subject = `Your ${app.appName} password has been reset`

  constructor(private user: User) {
    super()
  }
  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message.to(this.user.email).html(
      `
        <h1>Password Successfully Reset</h1>
        <p>Hi ${this.user.fullName},</p>
        <p>This is a confirmation that the password for your ${app.appName} account has been successfully updated.</p>
        <p>If you did not perform this action, please contact our support team immediately to secure your account.</p>
        <p>Thank you,<br/>The ${app.appName} Team</p>
      `
    )
  }
}
