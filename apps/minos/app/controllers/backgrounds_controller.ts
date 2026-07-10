import Background from '#models/background'
import BackgroundTransformer from '#transformers/background_transformer'
import { selectBackgroundValidator } from '#validators/background'
import type { HttpContext } from '@adonisjs/core/http'

export default class BackgroundsController {
  async index({ auth, serialize }: HttpContext) {
    auth.getUserOrFail()
    const backgrounds = await Background.query().orderBy('created_at', 'asc')

    return serialize(BackgroundTransformer.transform(backgrounds))
  }

  async show({ params, serialize }: HttpContext) {
    const background = await Background.findOrFail(params.id)

    return serialize(BackgroundTransformer.transform(background))
  }

  async select({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { id } = await request.validateUsing(selectBackgroundValidator)

    user.backgroundId = id
    user.save()

    return response.noContent()
  }
}
