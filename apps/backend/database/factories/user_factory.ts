import User from '#models/user'
import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dob: DateTime.fromJSDate(faker.date.birthdate()),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      emailVerifiedAt: DateTime.now(),
    }
  })
  .build()
