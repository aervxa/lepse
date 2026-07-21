import Habit from '#models/habit'
import HabitPeriod from '#models/habit_period'
import HabitPeriodPolicy from '#policies/habit_period_policy'
import HabitPeriodTransformer from '#transformers/habit_period_transformer'
import { optionalDateRangeValidator } from '#validators/date_range'
import type { HttpContext } from '@adonisjs/core/http'

export default class HabitPeriodController {
  // Helper for increment and decrement
  async #updateCount({ params, bouncer, clientDate, serialize }: HttpContext, delta: 1 | -1) {
    const habit = await Habit.findOrFail(params.id)
    await bouncer.with(HabitPeriodPolicy).authorize('update', habit)

    const habitPeriod = await HabitPeriod.getPeriodOrCreate(habit, clientDate!)
    habitPeriod.updateCount(delta, habit.target)
    await habitPeriod.save()

    return serialize(HabitPeriodTransformer.transform(habitPeriod))
  }

  async increment(ctx: HttpContext) {
    return this.#updateCount(ctx, 1)
  }

  async decrement(ctx: HttpContext) {
    return this.#updateCount(ctx, -1)
  }

  async count({ params, request, bouncer, clientDate, serialize }: HttpContext) {
    const habit = await Habit.findOrFail(params.id)
    await bouncer.with(HabitPeriodPolicy).authorize('show', habit)
    const { date } = await request.validateUsing(optionalDateRangeValidator)
    const habitPeriod = await HabitPeriod.getPeriodOrFail(habit, date ?? clientDate!)

    return serialize(HabitPeriodTransformer.transform(habitPeriod))
  }
}
