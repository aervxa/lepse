import { LoungePeer } from '#types/index'
import { PublicUser } from '#types/user'
import { BaseChannel } from '@rlanz/socket'
import { onMessage } from '@rlanz/socket/decorators'
import type { AuthenticatedSocket, PresenceInfo } from '@rlanz/socket/types'

type ServerEvents = {
  'lounge:resync': null
  'lounge:timer': LoungePeer
}

export default class LoungeChannel extends BaseChannel<PublicUser, ServerEvents> {
  static pattern = 'lounge/:id'
  static options = { presence: true }

  getPresenceInfo(socket: AuthenticatedSocket<PublicUser>): PresenceInfo {
    const { id, ...data } = socket.getUserOrFail()

    return {
      id: id.toString(),
      data,
    }
  }

  // Support asking resync when the user connects (even on another client)
  async onJoin() {
    this.broadcast('lounge:resync', null)
  }

  @onMessage('lounge:sync')
  async sendMessage(
    socket: AuthenticatedSocket<PublicUser>,
    { timer }: Pick<LoungePeer, 'timer'>
  ): Promise<LoungePeer> {
    const user = socket.getUserOrFail()

    const data = {
      user,
      timer,
    }

    this.broadcastExcept(socket.id, 'lounge:timer', data)
    return data
  }
}
