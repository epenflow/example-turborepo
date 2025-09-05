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

// router.get('/uploads/:fileName', async ({ response, params }) => {
//   const fileName = params.fileName
//   const filePath = app.publicPath(`uploads/${fileName}`)

//   try {
//     await fs.access(filePath, fs.constants.F_OK)
//   } catch (error) {
//     return response.notFound('Avatar not found')
//   }

//   return response.download(filePath)
// })

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
}

router
  .group(() => {
    router.post('sign-in', [AuthController.Session, 'signIn'])
    router.post('sign-up', [AuthController.Session, 'signUp'])
    router.post('forgot-password', [AuthController.Password, 'forgot'])
    router.post('reset-password', [AuthController.Password, 'reset']).as('reset-password')

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
