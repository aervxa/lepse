import type { HttpContext } from '@adonisjs/core/http'
import Goal from '#models/goal'
import GoalPolicy from '#policies/goal_policy'
import GoalTransformer from '#transformers/goal_transformer'
import { createGoalValidator, updateGoalValidator } from '#validators/goal'

export default class GoalsController {
  /**
   * Display a list of resource
   */
  async index({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const goals = await Goal.query().where('user_id', user.id)

    return serialize(GoalTransformer.transform(goals))
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
    const payload = await request.validateUsing(createGoalValidator)

    const goal = await Goal.create({
      userId: user.id,
      ...payload,
    })
    await goal.refresh()

    return response.created(await serialize(GoalTransformer.transform(goal)))
  }

  /**
   * Show individual record
   */
  async show({ params, bouncer, serialize }: HttpContext) {
    const goal = await Goal.findOrFail(params.id)
    await bouncer.with(GoalPolicy).authorize('show', goal)

    return serialize(GoalTransformer.transform(goal))
  }

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, bouncer, serialize }: HttpContext) {
    const goal = await Goal.findOrFail(params.id)
    await bouncer.with(GoalPolicy).authorize('update', goal)

    const payload = await request.validateUsing(updateGoalValidator)
    goal.merge(payload)
    await goal.save()

    return serialize(GoalTransformer.transform(goal))
  }

  /**
   * Delete record
   */
  async destroy({ params, bouncer, response }: HttpContext) {
    const goal = await Goal.findOrFail(params.id)
    await bouncer.with(GoalPolicy).authorize('destroy', goal)

    await goal.delete()

    return response.noContent()
  }
}
