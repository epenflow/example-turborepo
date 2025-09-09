import User from '#models/user'
import app from '@adonisjs/core/services/app'
import { BaseMail } from '@adonisjs/mail'

export default class SendEmailVerificationNotification extends BaseMail {
  constructor(
    private event: {
      user: User
      link?: string
      expiresAt?: string
      type: 'request' | 'confirm'
    }
  ) {
    super()
  }

  prepare(): void | Promise<void> {
    let subject: string
    let body: string
    if (this.event.type === 'request') {
      subject = 'Email Verification Request'
      body = `
        <h1>Verify Your Email Address</h1>
        <p>Hello ${this.event.user.fullName},</p>
        <p>Thank you for signing up! Please click the button below to verify your email address and activate your account:</p>
        <p><a href="${this.event.link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify My Email</a></p>
        <p>This link is only valid for ${this.event.expiresAt}. If you did not sign up for an account, you can safely ignore this email.</p>
      `
    } else {
      subject = `Your email is verified for ${app.appName}`
      body = `
        <h1>Email Successfully Verified!</h1>
        <p>Hi ${this.event.user.fullName},</p>
        <p>Great news! Your email address has been successfully verified.</p>
        <p>Your account is now fully active, and you can start using all of ${app.appName}'s features. You can log in now by clicking the link below.</p>
        <p>
          <a href="${this.event.link}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Go to Login
          </a>
        </p>
        <p>Thank you,<br/>The ${app.appName} Team</p>
      `
    }
    this.message.to(this.event.user.email).subject(subject).html(body)
  }
}
