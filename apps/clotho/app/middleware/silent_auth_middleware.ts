import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SilentAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Set token from cookie onto Authorization header (overrides a sent authorization header)
    // NOTE: doesn't work when set straightly inside auth_middleware, maybe since this runs first
    const token = ctx.request.qs().token ?? ctx.request.cookie('auth_token')
    if (token) ctx.request.request.headers['authorization'] = `Bearer ${token}`

    await ctx.auth.check()

    return next()
  }
}
