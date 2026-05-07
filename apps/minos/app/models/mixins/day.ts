import { type BaseModel } from '@adonisjs/lucid/orm'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { errors } from '@adonisjs/lucid'

export function Day<T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) {
  class MixinClass extends superclass {
    public static async getDayOrFail(userId: number, date: string) {
      const day = await this.query().where({ userId, date }).first()
      if (!day) throw new errors.E_ROW_NOT_FOUND()
      return day
    }
    public static async getDayOrCreate(userId: number, date: string) {
      return this.firstOrCreate({ userId, date } as any, { userId, date } as any)
    }
  }
  return MixinClass
}
