import User from '#models/user'
import { BaseMail } from '@adonisjs/mail'

export default class SendResetPasswordRequestNotification extends BaseMail {
  // from = 'onboarding@resend.dev'
  subject = 'Password Reset Request'

  constructor(
    private user: User,
    private resetPasswordLink: string
  ) {
    super()
  }
  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    this.message.to(this.user.email).html(
      `
        <h1>Password Reset Request</h1>
        <p>Hello ${this.user.fullName},</p>
        <p>We received a request to reset the password for your account. If you made thirequest, click the button below to choose a new password:</p>
        <p>
          <a href="${this.resetPasswordLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset My Password
          </a>
        </p>
        <p>This link is only valid for 1 hour. If you do not reset your password within this time, you will need to submit another request.</p>
        <p>If you did not request a password reset, you can safely ignore this email. Your password will not be changed.</p>
      `
    )
  }
}
