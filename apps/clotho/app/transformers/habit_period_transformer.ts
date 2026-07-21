import { BaseTransformer } from '@adonisjs/core/transformers'
import type HabitPeriod from '#models/habit_period'

export default class HabitPeriodTransformer extends BaseTransformer<HabitPeriod> {
  toObject() {
    return this.pick(this.resource, ['id', 'habitId', 'start', 'end', 'count', 'completed'])
  }
}
