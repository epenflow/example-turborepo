import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { DateTime } from 'luxon'

const userInfo = vine.object({
  firstName: vine.string().optional().nullable(),
  lastName: vine.string().optional().nullable(),
  dob: vine
    .string()
    .transform((date) => DateTime.fromISO(date))
    .optional(),
  avatar: vine
    .file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })
    .optional(),
})

vine.messagesProvider = new SimpleMessagesProvider({
  'username.regex':
    'The username field can only contain lowercase letters, numbers, underscore, or periods',
  'password.regex':
    'The password field must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  'password.minLength': 'The password field must be at least {{ min }} characters long',
})

export const userCredentials = vine.object({
  username: vine.string().regex(/^[a-z0-9._]+$/),
  email: vine.string().email(),
  password: vine
    .string()
    .minLength(4)
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/),
})

export const updateUser = vine.withMetaData<{ id: string | number }>().compile(
  vine.object({
    ...userInfo.getProperties(),
    username: userCredentials
      .getProperties()
      .username.unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .whereNot('id', field.meta.id)
          .where('username', value)
          .first()
        return !user
      })
      .optional(),
    email: userCredentials
      .getProperties()
      .email.unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .whereNot('id', field.meta.id)
          .where('email', value)
          .first()
        return !user
      })
      .optional(),
    password: userCredentials.getProperties().password.optional(),
  })
)

export const createUser = vine.compile(
  vine.object({
    ...userInfo.getProperties(),
    username: userCredentials
      .getProperties()
      .username.unique({ column: 'username', table: 'users' }),
    email: userCredentials.getProperties().email.unique({ column: 'email', table: 'users' }),
    password: userCredentials.getProperties().password,
  })
)

export const destroyUser = vine.compile(
  vine.object({
    password: vine.string(),
  })
)
