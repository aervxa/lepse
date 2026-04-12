import type { HttpContext } from '@adonisjs/core/http'
import FocusSession from '#models/focus_session'
import FocusSessionTransformer from '#transformers/focus_session_transformer'
import { focusSessionValidator } from '#validators/focus_session'

export default class FocusSessionsController {
  async show({ auth, response }: HttpContext) {
    const session = await FocusSession.getToday(auth.getUserOrFail().id)

    return response.ok(FocusSessionTransformer.transform(session))
  }

  async update({ request, auth, response }: HttpContext) {
    const { pomoCount = 0, stopwatchMs = 0 } = await request.validateUsing(focusSessionValidator)

    const session = await FocusSession.getToday(auth.getUserOrFail().id)
    session.pomoCount = pomoCount
    session.stopwatchMs = stopwatchMs
    await session.save()

    return response.ok(FocusSessionTransformer.transform(session))
  }

  async destroy({ auth, response }: HttpContext) {
    const session = await FocusSession.getToday(auth.getUserOrFail().id)
    await session.delete()

    return response.noContent()
  }
}
