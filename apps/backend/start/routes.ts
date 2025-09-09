/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const TokenProvider = () => import('#controllers/token_provider')

// router.get('tokens/all', [TokenProvider, 'all'])
// router.get('tokens/clear-tokens', [TokenProvider, 'clearTokens'])
// router.get('tokens/invalidated/:token', [TokenProvider, 'invalidated'])
// router.get('tokens/verify/:token/:type', [TokenProvider, 'verify'])
// router.get('tokens/create', [TokenProvider, 'create'])

router
  .group(() => {
    router
      .group(() => {
        router.resource('users', () => import('#controllers/users_controller')).apiOnly()
      })
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('api')

const AuthController = {
  Session: () => import('#controllers/auth/session_controller'),
  Password: () => import('#controllers/auth/password_controller'),
  Account: () => import('#controllers/auth/account_controller'),
  Email: () => import('#controllers/auth/email_controller'),
}

router
  .group(() => {
    router.post('sign-in', [AuthController.Session, 'signIn'])
    router.post('sign-up', [AuthController.Session, 'signUp'])
    router.post('forgot-password', [AuthController.Password, 'forgot'])
    router.post('reset-password', [AuthController.Password, 'reset']).as('reset-password')
    router.post('email-verification/send', [AuthController.Email, 'send'])
    router.get('email-verification/confirm', [AuthController.Email, 'confirm'])

    router
      .group(() => {
        router.get('me', [AuthController.Session, 'me'])

        router.post('change-password', [AuthController.Password, 'change'])
        router.post('delete-account', [AuthController.Account, 'destroy'])
        router.post('update-account', [AuthController.Account, 'update'])

        router.delete('sign-out', [AuthController.Session, 'signOut'])
      })
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('auth')
