import type { HttpContext } from '@adonisjs/core/http'
import FocusSession from '#models/focus_session'
import FocusSessionTransformer from '#transformers/focus_session_transformer'
import { focusSessionValidator } from '#validators/focus_session'

export default class FocusSessionsController {
  async show({ auth, params, serialize }: HttpContext) {
    const session = await FocusSession.getDay(auth.getUserOrFail().id, params.date as string)

    return serialize(FocusSessionTransformer.transform(session))
  }

  async update({ request, auth, params, serialize }: HttpContext) {
    const data = await request.validateUsing(focusSessionValidator)

    const session = await FocusSession.getDay(auth.getUserOrFail().id, params.date as string)
    session.merge(data)
    await session.save()

    return serialize(FocusSessionTransformer.transform(session))
  }

  async destroy({ auth, params, response }: HttpContext) {
    const session = await FocusSession.getDay(auth.getUserOrFail().id, params.date as string)
    await session.delete()

    return response.noContent()
  }
}
