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

  public static async getPeriodOrCreate(userId: number, habit: Habit, clientDate: string) {
    let start = clientDate
    let end = clientDate

    if (habit.frequency === 'weekly') {
      /**
       * Compute week start and end
       * NOTE: Luxon keeps 1-7 where 1 is Monday and Sunday is 7
       */
      const dt = DateTime.fromISO(clientDate)
      const delta = dt.weekday % 7 // days since current week's sunday
      start = dt.minus({ days: delta }).toISODate()! // move back to sunday (start of week)
      end = dt.plus({ days: 6 - delta }).toISODate()! // move forward to saturday (end of week)
    }

    const payload = { userId, habitId: habit.id, start, end } as any
    return this.firstOrCreate(payload, payload)
  }

  async updateCount(delta: 1 | -1, target: number) {
    this.count = Math.max(0, this.count + delta)
    this.completed = this.count >= target
  }
}
