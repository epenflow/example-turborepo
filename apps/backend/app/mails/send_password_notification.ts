import User from '#models/user'
import app from '@adonisjs/core/services/app'
import { BaseMail } from '@adonisjs/mail'

export type Options = { user: User } & (
  | { type: 'request'; expiresAt: string; link: string }
  | { type: 'confirm' }
)

export default class SendPasswordResetNotification extends BaseMail {
  constructor(private options: Options) {
    super()
  }

  prepare() {
    let subject: string
    let htmlContent: string

    if (this.options.type === 'request') {
      subject = 'Password Reset Request'
      htmlContent = `
        <h1>Password Reset Request</h1>
        <p>Hello ${this.options.user.fullName},</p>
        <p>We received a request to reset the password for your account. If you made this request, click the button below to choose a new password:</p>
        <p>
          <a href="${this.options.link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset My Password
          </a>
        </p>
        <p>This link is only valid ${this.options.expiresAt}. If you do not reset your password within this time, you will need to submit another request.</p>
        <p>If you did not request a password reset, you can safely ignore this email. Your password will not be changed.</p>
      `
    } else {
      // type === 'confirm'
      subject = `Your ${app.appName} password has been reset`
      htmlContent = `
        <h1>Password Successfully Reset</h1>
        <p>Hi ${this.options.user.fullName},</p>
        <p>This is a confirmation that the password for your ${app.appName} account has been successfully updated.</p>
        <p>If you did not perform this action, please contact our support team immediately to secure your account.</p>
        <p>Thank you,<br/>The ${app.appName} Team</p>
      `
    }

    this.message.to(this.options.user.email).subject(subject).html(htmlContent)
  }
}
