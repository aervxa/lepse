import type { HttpContext } from '@adonisjs/core/http'
import Scribble from '#models/scribble'
import ScribblePolicy from '#policies/scribble_policy'
import ScribbleTransformer from '#transformers/scribble_transformer'
import { createScribbleValidator, updateScribbleValidator } from '#validators/scribble'

export default class ScribblesController {
  /**
   * Display a list of resource
   */
  async index({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const scribbles = await Scribble.query()
      .where('user_id', user.id)
      .orderBy('updated_at', 'desc')
      .orderBy('created_at', 'desc')

    return serialize(ScribbleTransformer.transform(scribbles))
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ auth, request, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(createScribbleValidator)

    const scribble = await Scribble.create({
      userId: user.id,
      ...payload,
    })
    await scribble.refresh()

    return response.created(await serialize(ScribbleTransformer.transform(scribble)))
  }

  /**
   * Show individual record
   */
  async show({ params, bouncer, serialize }: HttpContext) {
    const scribble = await Scribble.findOrFail(params.id)
    await bouncer.with(ScribblePolicy).authorize('show', scribble)

    return serialize(ScribbleTransformer.transform(scribble))
  }

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, bouncer, serialize }: HttpContext) {
    const scribble = await Scribble.findOrFail(params.id)
    await bouncer.with(ScribblePolicy).authorize('update', scribble)

    const payload = await request.validateUsing(updateScribbleValidator)
    scribble.merge(payload)
    await scribble.save()

    return serialize(ScribbleTransformer.transform(scribble))
  }

  /**
   * Delete record
   */
  async destroy({ params, bouncer, response }: HttpContext) {
    const scribble = await Scribble.findOrFail(params.id)
    await bouncer.with(ScribblePolicy).authorize('destroy', scribble)

    await scribble.delete()

    return response.noContent()
  }
}
