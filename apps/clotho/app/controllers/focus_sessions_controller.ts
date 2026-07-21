import type { HttpContext } from '@adonisjs/core/http'
import FocusSession from '#models/focus_session'
import FocusSessionTransformer from '#transformers/focus_session_transformer'
import { focusSessionValidator } from '#validators/focus_session'
import { dateRangeValidator } from '#validators/date_range'
import { getDateRange } from '../lib/util/date.ts'

export default class FocusSessionsController {
  async index({ auth, request, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const { date, frequency } = await request.validateUsing(dateRangeValidator)
    const { start, end } = getDateRange(date, frequency)
    const sessions = await FocusSession.query()
      .where('userId', user.id)
      .where('date', '>=', start)
      .where('date', '<=', end)

    return serialize(FocusSessionTransformer.transform(sessions))
  }

  async show({ auth, params, serialize }: HttpContext) {
    const session = await FocusSession.getDayOrFail(auth.getUserOrFail().id, params.date as string)

    return serialize(FocusSessionTransformer.transform(session))
  }

  async update({ request, auth, params, serialize }: HttpContext) {
    const data = await request.validateUsing(focusSessionValidator)

    const session = await FocusSession.getDayOrCreate(
      auth.getUserOrFail().id,
      params.date as string
    )
    session.merge(data)
    await session.save()

    return serialize(FocusSessionTransformer.transform(session))
  }

  async destroy({ auth, params, response }: HttpContext) {
    const session = await FocusSession.getDayOrFail(auth.getUserOrFail().id, params.date as string)

    await session.delete()

    return response.noContent()
  }
}
