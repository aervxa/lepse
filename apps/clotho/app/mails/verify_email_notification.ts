import type User from '#models/user'
import env from '#start/env'
import { BaseMail } from '@adonisjs/mail'

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
    const url = env.get('FRONTEND_URL') + `/verify/email?token=${this.token}`
    this.message
      .to(this.user.email)
      .htmlView('emails/verify_email_html', { user: this.user, url })
      .textView('emails/verify_email_text', { user: this.user, url })
  }
}
