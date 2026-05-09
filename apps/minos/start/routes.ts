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
        router
          .group(() => {
            router.get('/profile', [controllers.Profile, 'show'])
          })
          .prefix('account')
          .as('account')

        router
          .group(() => {
            router
              .group(() => {
                router.get('', [controllers.TaskDays, 'index']).as('index')
                router.post('', [controllers.TaskDays, 'store']).as('store')
                router.delete(':id', [controllers.TaskDays, 'destroy']).as('destroy')
              })
              .prefix('tasks')
              .as('tasks')

            router
              .group(() => {
                router.get('', [controllers.FocusSessions, 'show']).as('show')
                router.patch('', [controllers.FocusSessions, 'update']).as('update')
              })
              .prefix('session')
              .as('session')

            router
              .group(() => {
                router.get('', [controllers.Journals, 'show']).as('show')
                router.patch('', [controllers.Journals, 'update']).as('update')
              })
              .prefix('journal')
              .as('journal')
          })
          .prefix('day/:date')
          .where('date', { match: /^\d{4}-\d{2}-\d{2}$/ })
          .as('day')

        // Have index (listing) have it's own endpoint since it doesn't belong in a specific date
        router.get('journals', [controllers.Journals, 'index'])

        router.resource('tasks', controllers.Tasks).use(['update'], middleware.clientDate())
        router.resource('goals', controllers.Goals)
      })
      .use(middleware.auth())
  })
  .prefix('/api/v1')
