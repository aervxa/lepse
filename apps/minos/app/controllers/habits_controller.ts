import type { HttpContext } from '@adonisjs/core/http'
import Habit from '#models/habit'
import HabitPolicy from '#policies/habit_policy'
import HabitTransformer from '#transformers/habit_transformer'
import { createHabitValidator, updateHabitValidator } from '#validators/habit'
import HabitPeriod from '#models/habit_period'
import db from '@adonisjs/lucid/services/db'

export default class HabitsController {
  /**
   * Display a list of resource
   */
  async index({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const habits = await Habit.query().where('user_id', user.id).orderBy('created_at', 'asc')

    return serialize(HabitTransformer.transform(habits))
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
    const payload = await request.validateUsing(createHabitValidator)

    const habit = await Habit.create({
      userId: user.id,
      ...payload,
    })
    await habit.refresh()

    return response.created(await serialize(HabitTransformer.transform(habit)))
  }

  /**
   * Show individual record
   */
  async show({ params, bouncer, serialize }: HttpContext) {
    const habit = await Habit.findOrFail(params.id)
    await bouncer.with(HabitPolicy).authorize('show', habit)

    return serialize(HabitTransformer.transform(habit))
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, bouncer, clientDate, serialize }: HttpContext) {
    const habit = await Habit.findOrFail(params.id)
    await bouncer.with(HabitPolicy).authorize('update', habit)

    const payload = await request.validateUsing(updateHabitValidator)
    habit.merge(payload)

    // Update only current habit_period.completed if target changes
    if (clientDate && habit.$dirty.target) {
      const hp = await HabitPeriod.getPeriod(habit, clientDate)
      hp?.updateCount(0, habit.target)
    }

    await habit.save()

    return serialize(HabitTransformer.transform(habit))
  }

  /**
   * Delete record
   */
  async destroy({ params, bouncer, response }: HttpContext) {
    const habit = await Habit.findOrFail(params.id)
    await bouncer.with(HabitPolicy).authorize('destroy', habit)

    await habit.delete()

    return response.noContent()
  }
}
