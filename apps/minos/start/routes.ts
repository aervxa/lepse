/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
        router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
      })
      .prefix('account')
      .as('account')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('show', [controllers.FocusSessions, 'show'])
        router.patch('update', [controllers.FocusSessions, 'update'])
        router.delete('reset', [controllers.FocusSessions, 'destroy'])
      })
      .prefix('session')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('tasks', [controllers.TaskDays, 'index'])
        router.post('tasks', [controllers.TaskDays, 'store'])
        router.delete('tasks/:id', [controllers.TaskDays, 'destroy'])
      })
      .prefix('day/:date')
      .where('date', { match: /^\d{4}-\d{2}-\d{2}$/ })
      .as('day')
      .use(middleware.auth())

    router.resource('tasks', controllers.Tasks)
    router.resource('goals', controllers.Goals)
  })
  .prefix('/api/v1')
