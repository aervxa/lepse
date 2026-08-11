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
import { apiThrottle, throttle } from './limiter.ts'
import limiter from '@adonisjs/limiter/services/main'

router
  .on('/ping')
  .setHandler(() => 'pong')
  .use(throttle)

// WEB ROUTES (routes that users access on the server)
router
  .group(() => {
    // TODO: redirect to actual homepage later on (atropos)
    router.on('/').render('pages/home').as('home').use(throttle)
    router.get('verify/email/:token', [controllers.VerifyEmail, 'verify']).as('verify.email')
  })
  .as('web')

// API
router
  .group(() => {
    // Authentication
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
        router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    // Verification
    router
      .get('verify/email/request', [controllers.VerifyEmail, 'request'])
      .as('verify.email.request')
      .use(middleware.auth())
      .use(limiter.define('verifyEmailRequest', () => limiter.allowRequests(1).every('1 minute')))

    // Backgrounds (index only)
    router.get('backgrounds', [controllers.Backgrounds, 'index'])

    // Authenticated users only
    router
      .group(() => {
        router
          .group(() => {
            router.get('profile', [controllers.Profile, 'show'])
            router.patch('profile', [controllers.Profile, 'update']).use(middleware.verifiedEmail())
          })
          .prefix('account')
          .as('account')

        // Backgrounds (select only)
        router
          .patch('backgrounds/select', [controllers.Backgrounds, 'select'])
          .use(middleware.verifiedEmail())

        // Verified users only (main app features)
        router
          .group(() => {
            // Date specific
            router
              .group(() => {
                // Taskdays
                router
                  .group(() => {
                    router.get('', [controllers.TaskDays, 'index']).as('index')
                    router.post('', [controllers.TaskDays, 'store']).as('store')
                    router.delete(':id', [controllers.TaskDays, 'destroy']).as('destroy')
                  })
                  .prefix('tasks')
                  .as('tasks')

                // Focus sessions
                router
                  .group(() => {
                    router.get('', [controllers.FocusSessions, 'show']).as('show')
                    router.patch('', [controllers.FocusSessions, 'update']).as('update')
                    router.delete('', [controllers.FocusSessions, 'destroy']).as('destroy')
                  })
                  .prefix('session')
                  .as('session')

                // Journals
                // router
                //   .group(() => {
                //     router.get('', [controllers.Journals, 'show']).as('show')
                //     router.patch('', [controllers.Journals, 'update']).as('update')
                //   })
                //   .prefix('journal')
                //   .as('journal')
              })
              .prefix('day/:date')
              .where('date', { match: DATE_REGEX })
              .as('day')

            // Have index (listing) have it's own endpoint since it doesn't belong in a specific date
            // router.get('journals', [controllers.Journals, 'index'])
            router.get('focus-sessions', [controllers.FocusSessions, 'index'])

            // Habit periods
            // router
            //   .group(() => {
            //     router.patch('increment', [controllers.HabitPeriods, 'increment']).as('increment')
            //     router.patch('decrement', [controllers.HabitPeriods, 'decrement']).as('decrement')
            //     router.get('count', [controllers.HabitPeriods, 'count']).as('count')
            //   })
            //   .prefix('habits/:id')
            //   .as('habits')
            //   .use(middleware.clientDate())

            // Resources
            router.resource('tasks', controllers.Tasks).use(['update'], middleware.clientDate())
            router.resource('goals', controllers.Goals)
            // router.resource('scribbles', controllers.Scribbles)
            // router.resource('habits', controllers.Habits).use(['update'], middleware.clientDate())
          })
          .use(middleware.verifiedEmail())
      })
      .use(middleware.auth())
  })
  .prefix('/api/v1')
  .use(middleware.forceJsonResponse())
  .use(apiThrottle)
