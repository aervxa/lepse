import { FocusSessionSchema } from '#database/schema'
import { DateTime } from 'luxon'

export default class FocusSession extends FocusSessionSchema {
  public static async getDay(userId: number, date: string) {
    return this.firstOrCreate(
      // @ts-ignore | SQLite needs a string for searching instead of DateTime
      { userId, date: date },
      { pomoCount: 0, stopwatchMs: 0, date: DateTime.now().toISODate() }
    )
  }
}
