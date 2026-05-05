import type { HttpContext } from '@adonisjs/core/http'
import Journal from '#models/journal'
import JournalTransformer from '#transformers/journal_transformer'
import { updateJournalValidator } from '#validators/journal'

export default class JournalsController {
  async show({ auth, params, serialize }: HttpContext) {
    const session = await Journal.getDay(auth.getUserOrFail().id, params.date as string)

    return serialize(JournalTransformer.transform(session))
  }

  async update({ request, auth, params, serialize }: HttpContext) {
    const data = await request.validateUsing(updateJournalValidator)

    const session = await Journal.getDay(auth.getUserOrFail().id, params.date as string)
    session.merge(data)
    await session.save()

    return serialize(JournalTransformer.transform(session))
  }
}
