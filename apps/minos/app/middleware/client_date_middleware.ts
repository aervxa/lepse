import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { DATE_REGEX } from '../lib/util/date.ts'

export default class ClientDateMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Verify existence and validity of date
     */
    const raw = ctx.request.header('x-client-date')
    if (!raw || !DATE_REGEX.test(raw)) {
      return ctx.response.badRequest({ error: 'Missing or invalid x-client-date header' })
    }

    /**
     * Reject stale dates
     * allow one day offset to account for timezones
     */
    const delta = Date.now() - new Date(raw).getTime()
    if (Math.abs(delta) / 86_400_000 /* milliseconds for a day */ > 1) {
      return ctx.response.badRequest({ error: 'Stale x-client-date header' })
    }

    // Share x-client-date as clientDate
    ctx.clientDate = raw

    return next()
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    clientDate: string | undefined
  }
}
