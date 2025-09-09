import { UserFactory } from '#database/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

const users: string[] = []
for (let i = 0; i <= 5; i++) {
  const name = `user${i}`

  users.push(name)
}

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    for (const user of users) {
      await UserFactory.merge({ email: `${user}@test.com`, password: user }).create()
    }

    await UserFactory.merge({ email: 'epenflow@gmail.com', password: '1' }).create()
    await UserFactory.merge({
      email: 'inyomanbudayasa86@gmail.com',
      password: '1',
      emailVerifiedAt: null,
    }).create()
  }
}
