import type { HttpContext } from '@adonisjs/core/http'
import FocusSession from '#models/focus_session'
import FocusSessionTransformer from '#transformers/focus_session_transformer'
import { focusSessionValidator } from '#validators/focus_session'

export default class FocusSessionsController {
  async show({ auth, serialize }: HttpContext) {
    const session = await FocusSession.getToday(auth.getUserOrFail().id)

    return serialize(FocusSessionTransformer.transform(session))
  }

  async update({ request, auth, serialize }: HttpContext) {
    const data = await request.validateUsing(focusSessionValidator)

    const session = await FocusSession.getToday(auth.getUserOrFail().id)
    session.merge(data)
    await session.save()

    return serialize(FocusSessionTransformer.transform(session))
  }

  async destroy({ auth, response }: HttpContext) {
    const session = await FocusSession.getToday(auth.getUserOrFail().id)
    await session.delete()

    return response.noContent()
  }
}
