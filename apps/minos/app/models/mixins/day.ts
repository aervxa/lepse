import { type BaseModel } from '@adonisjs/lucid/orm'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'

export function Day<T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) {
  class MixinClass extends superclass {
    public static async getDay(userId: number, date: string) {
      // @ts-ignore | SQLite needs a string for searching instead of DateTime
      return this.firstOrCreate({ userId, date }, { date })
    }
  }
  return MixinClass
}
