import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { beforeCreate, hasMany } from '@adonisjs/lucid/orm'
import mail from '@adonisjs/mail/services/main'
import VerifyEmailNotification from '#mails/verify_email_notification'
import Background from './background.ts'
import Token from './token.ts'
import { type HasMany } from '@adonisjs/lucid/types/relations'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  get initials() {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }

  @hasMany(() => Token)
  declare tokens: HasMany<typeof Token>
  @hasMany(() => Token, { onQuery: (query) => query.where('type', 'VERIFY_EMAIL') })
  declare verifyEmailTokens: HasMany<typeof Token>

  async sendVerifyEmail() {
    const token = await Token.generate(this, 'VERIFY_EMAIL')
    await mail.sendLater(new VerifyEmailNotification(this, token))
  }
}
