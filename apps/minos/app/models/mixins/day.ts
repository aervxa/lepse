import { type BaseModel } from '@adonisjs/lucid/orm'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'

export function Day<T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) {
  class MixinClass extends superclass {
    public static async getDayOrFail(userId: number, date: string) {
      return this.query().where({ userId, date }).firstOrFail()
    }
    public static async getDayOrCreate(userId: number, date: string) {
      return this.firstOrCreate({ userId, date } as any, { userId, date } as any)
    }
  }
  return MixinClass
}
