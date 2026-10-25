import type User from '#models/user'
import { authenticateWithAdonisAuth, defineConfig } from '@rlanz/socket'
import { allowedOrigins } from '../app/lib/util/origin.ts'

export default defineConfig({
  websocket: {
    origin: allowedOrigins,
    middleware: [
      () => import('@adonisjs/auth/initialize_auth_middleware'),
      () => import('#middleware/silent_auth_middleware'),
    ],
    authenticate: authenticateWithAdonisAuth<User>(),
  },
})
