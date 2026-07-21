import { HabitPeriodSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Habit from './habit.ts'
import { getDateRange, RangeFrequency } from '../lib/util/date.ts'

export default class HabitPeriod extends HabitPeriodSchema {
  /**
   * A habit period belongs to a habit
   */
  @belongsTo(() => Habit)
  declare habit: BelongsTo<typeof Habit>

  public static async getPeriod(habit: Habit, clientDate: string) {
    const { start, end } = getDateRange(clientDate, habit.frequency as RangeFrequency)

    return this.query().where({ habitId: habit.id, start, end }).first()
  }

  public static async getPeriodOrCreate(habit: Habit, clientDate: string) {
    const { start, end } = getDateRange(clientDate, habit.frequency as RangeFrequency)

    const payload = { userId: habit.userId, habitId: habit.id, start, end } as any
    const period = await this.firstOrCreate(payload, payload)
    return period.refresh()
  }

  public static async getPeriodOrFail(habit: Habit, clientDate: string) {
    const { start, end } = getDateRange(clientDate, habit.frequency as RangeFrequency)

    return this.query().where({ habitId: habit.id, start, end }).firstOrFail()
  }

  async updateCount(delta: 0 | 1 | -1, target: number) {
    this.count = Math.max(0, this.count + delta)
    this.completed = this.count >= target
  }
}
