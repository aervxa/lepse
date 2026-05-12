import { HabitSchema } from '#database/schema'
import { column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import HabitPeriod from './habit_period.ts'

type Reminder =
  | { time: string } // daily
  | { day: number; time: string } // weekly

export default class Habit extends HabitSchema {
  /**
   * Store reminders in text, but read JSON string[]
   */
  @column({
    prepare: (value: Reminder[]) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value),
  })
  declare reminders: Reminder[]

  /**
   * A habit has many habit periods
   */
  @hasMany(() => HabitPeriod)
  declare periods: HasMany<typeof HabitPeriod>
}
