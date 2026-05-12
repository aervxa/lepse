import Habit from '#models/habit'
import HabitPeriod from '#models/habit_period'
import HabitPeriodPolicy from '#policies/habit_period_policy'
import HabitPeriodTransformer from '#transformers/habit_period_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class HabitPeriodController {
  // Helper for increment and decrement
  async #updateCount({ auth, params, bouncer, clientDate, serialize }: HttpContext, delta: 1 | -1) {
    const user = auth.getUserOrFail()
    const habit = await Habit.findOrFail(params.id)

    await bouncer.with(HabitPeriodPolicy).authorize('update', habit)

    const habitPeriod = await HabitPeriod.getPeriodOrCreate(user.id, habit, clientDate!)

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
}
