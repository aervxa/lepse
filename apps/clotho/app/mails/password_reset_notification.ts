import type User from '#models/user'
import { BaseMail } from '@adonisjs/mail'
import { urlFor } from '@adonisjs/core/services/url_builder'
import { appUrl } from '#config/app'
import config from '@adonisjs/core/services/config'

export default class PasswordResetNotification extends BaseMail {
  subject = ''

  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    const data = {
      user: this.user,
      url: urlFor('web.verify.password-reset', { token: this.token }, { prefixUrl: appUrl }),
    }
    this.message
      .to(this.user.email)
      .subject(`Reset your ${config.get('mail.globals.brandName')} password`)
      .htmlView('emails/password_reset_html', data)
      .textView('emails/password_reset_text', data)
  }
}
