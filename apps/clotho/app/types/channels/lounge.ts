import { type PublicUser } from '#types/user'

export type LoungeTimer = {
  user: PublicUser
  timer: { running: boolean; elapsed: number; duration: number } | null
}
