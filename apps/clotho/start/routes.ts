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
import { DATE_REGEX } from '../app/lib/util/date.ts'

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
      .get('verify/email/request', [controllers.VerifyEmail, 'request'])
      .as('verify.email.request')
      .use(middleware.auth())
    router
      .get('verify/email/:token', [controllers.VerifyEmail, 'verify'])
      .as('verify.email')
      .where('token', { match: /^.{64}$/, cast: String })

    router
      .group(() => {
        router
          .group(() => {
            router.get('profile', [controllers.Profile, 'show'])
            router.patch('profile', [controllers.Profile, 'update'])
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
                router.delete('', [controllers.FocusSessions, 'destroy']).as('destroy')
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
          .where('date', { match: DATE_REGEX })
          .as('day')

        // Have index (listing) have it's own endpoint since it doesn't belong in a specific date
        router.get('journals', [controllers.Journals, 'index'])
        router.get('focus-sessions', [controllers.FocusSessions, 'index'])

        router.resource('tasks', controllers.Tasks).use(['update'], middleware.clientDate())
        router.resource('goals', controllers.Goals)
        router.resource('scribbles', controllers.Scribbles)

        router.resource('habits', controllers.Habits).use(['update'], middleware.clientDate())
        router
          .group(() => {
            router.patch('increment', [controllers.HabitPeriods, 'increment']).as('increment')
            router.patch('decrement', [controllers.HabitPeriods, 'decrement']).as('decrement')
            router.get('count', [controllers.HabitPeriods, 'count']).as('count')
          })
          .prefix('habits/:id')
          .as('habits')
          .use(middleware.clientDate())

        router.get('backgrounds', [controllers.Backgrounds, 'index'])
        router.patch('backgrounds/select', [controllers.Backgrounds, 'select'])
      })
      .use(middleware.auth())
  })
  .prefix('/api/v1')
