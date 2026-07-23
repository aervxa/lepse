import { TokenSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import User from './user.ts'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import stringHelpers from '@adonisjs/core/helpers/string'
import { DateTime, DurationLike } from 'luxon'

const TOKEN_TYPE_RELATIONS = { VERIFY_EMAIL: 'verifyEmailTokens' } as const
type TokenType = keyof typeof TOKEN_TYPE_RELATIONS

export default class Token extends TokenSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  static async generate(
    user: User,
    type: TokenType,
    { expiresAfter = { hour: 1 } }: { expiresAfter?: DurationLike } = {}
  ) {
    const token = stringHelpers.generateRandom(64)

    // Invalidate old tokens of type
    await Token.expireAll(user, type)
    // Create new token
    await user
      .related('tokens')
      .create({ token, type, expiresAt: DateTime.now().plus(expiresAfter) })

    return token
  }

  static async expireAll(user: User, type: TokenType) {
    await user
      .related(TOKEN_TYPE_RELATIONS[type])
      .query()
      .update({ expiresAt: DateTime.now().toSQL() })
  }

  static async getUser(token: string) {
    const record = await Token.query()
      .preload('user')
      .where('token', token)
      .where('expiresAt', '>', DateTime.now().toSQL())
      .first()

    return record?.user
  }

  static async getLast(user: User, type: TokenType) {
    return user.related(TOKEN_TYPE_RELATIONS[type]).query().orderBy('created_at', 'desc').first()
  }
}
