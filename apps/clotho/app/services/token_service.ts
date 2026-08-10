import encryption from '@adonisjs/core/services/encryption'

class TokenService {
  createEmailVerificationToken(userId: number) {
    return encryption.encrypt({ userId }, { purpose: 'email-verification', expiresIn: '1h' })
  }

  verifyEmailVerificationToken(token: string) {
    return encryption.decrypt<{ userId: string }>(token, 'email-verification')
  }
}
export default new TokenService()
