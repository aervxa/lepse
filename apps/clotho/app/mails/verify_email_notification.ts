import type User from '#models/user'
import { BaseMail } from '@adonisjs/mail'
import { urlFor } from '@adonisjs/core/services/url_builder'

export default class VerifyEmailNotification extends BaseMail {
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
    const data = { user: this.user, url: urlFor('web.verify.email', { token: this.token }) }
    this.message
      .to(this.user.email)
      .subject('Please verify your email!')
      .htmlView('emails/verify_email_html', data)
      .textView('emails/verify_email_text', data)
  }
}
