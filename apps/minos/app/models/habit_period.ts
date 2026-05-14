import { HabitPeriodSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Habit from './habit.ts'
import { DateTime } from 'luxon'

export default class HabitPeriod extends HabitPeriodSchema {
  /**
   * A habit period belongs to a habit
   */
  @belongsTo(() => Habit)
  declare habit: BelongsTo<typeof Habit>

  static #getPeriodRange(clientDate: string, frequency: string) {
    let start = clientDate
    let end = clientDate

    if (frequency === 'weekly') {
      /**
       * Compute week start and end
       * NOTE: Luxon keeps 1-7 where 1 is Monday and Sunday is 7
       */
      const dt = DateTime.fromISO(clientDate)
      const delta = dt.weekday % 7 // days since current week's sunday
      start = dt.minus({ days: delta }).toISODate()! // move back to sunday (start of week)
      end = dt.plus({ days: 6 - delta }).toISODate()! // move forward to saturday (end of week)
    }

    return { start, end }
  }

  public static async getPeriod(habit: Habit, clientDate: string) {
    const { start, end } = this.#getPeriodRange(clientDate, habit.frequency)

    return this.query().where({ habitId: habit.id, start, end }).first()
  }

  public static async getPeriodOrCreate(habit: Habit, clientDate: string) {
    const { start, end } = this.#getPeriodRange(clientDate, habit.frequency)

    const payload = { userId: habit.userId, habitId: habit.id, start, end } as any
    const period = await this.firstOrCreate(payload, payload)
    return period.refresh()
  }

  public static async getPeriodOrFail(habit: Habit, clientDate: string) {
    const { start, end } = this.#getPeriodRange(clientDate, habit.frequency)

    return this.query().where({ habitId: habit.id, start, end }).firstOrFail()
  }

  async updateCount(delta: 0 | 1 | -1, target: number) {
    this.count = Math.max(0, this.count + delta)
    this.completed = this.count >= target
  }
}
