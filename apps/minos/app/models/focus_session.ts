import { FocusSessionSchema } from '#database/schema'

export default class FocusSession extends FocusSessionSchema {
  public static async getDay(userId: number, date: string) {
    // @ts-ignore | SQLite needs a string for searching instead of DateTime
    return this.firstOrCreate({ userId, date }, { pomoCount: 0, stopwatchMs: 0, date })
  }
}
