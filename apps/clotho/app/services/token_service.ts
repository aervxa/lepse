import encryption from '@adonisjs/core/services/encryption'

class TokenService {
  createEmailVerificationToken(userId: number) {
    return encryption.encrypt({ userId }, { purpose: 'email-verification', expiresIn: '1h' })
  }
  verifyEmailVerificationToken(token: string) {
    return encryption.decrypt<{ userId: string }>(token, 'email-verification')
  }

  createPasswordResetToken(userId: number) {
    return encryption.encrypt({ userId }, { purpose: 'password-reset', expiresIn: '30m' })
  }
  verifyPasswordResetToken(token: string) {
    return encryption.decrypt<{ userId: string }>(token, 'password-reset')
  }
}
export default new TokenService()
]
