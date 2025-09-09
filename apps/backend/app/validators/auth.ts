import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { userCredentials } from './user.js'

export const signIn = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

export const forgotPassword = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

vine.messagesProvider = new SimpleMessagesProvider({
  'new.regex':
    'The new password field must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  'confirm.confirmed': 'The confirm password field and new password must be the same',
})
const newPassword = vine.object({
  new: userCredentials.getProperties().password,
  confirm: vine.string().confirmed({
    confirmationField: 'new',
  }),
})

export const resetPassword = vine.compile(newPassword)

export const changePassword = vine.compile(
  vine.object({
    current: vine.string(),
    ...newPassword.getProperties(),
  })
)
export const emailVerification = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)
