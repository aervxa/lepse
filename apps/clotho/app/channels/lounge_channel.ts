import Lounge from '#models/lounge'
import { LoungePeer } from '#types/index'
import { PublicUser } from '#types/user'
import { searchLoungeValidator } from '#validators/lounge'
import { BaseChannel, SocketResponseError } from '@rlanz/socket'
import { onMessage } from '@rlanz/socket/decorators'
import type { AuthenticatedSocket, Middleware, PresenceInfo } from '@rlanz/socket/types'

type ServerEvents = {
  'lounge:resync': null
  'lounge:timer': LoungePeer
  'lounge:closed': null
}

export default class LoungeChannel extends BaseChannel<PublicUser, ServerEvents> {
  static pattern = 'lounge/:id'
  static options = { presence: true }
  static middlewares: Middleware<PublicUser>[] = [
    async (ctx, next) => {
      const [, result] = await searchLoungeValidator.tryValidate({ id: ctx.params.id })

      let lounge: Lounge | null = null
      if (result) {
        lounge = await Lounge.findBy('id', ctx.params.id)
      }

      if (!lounge) {
        throw new SocketResponseError('404: Lounge does not exist')
      } else if (ctx.socket.raw.data.hostId === undefined) {
        // ctx.socket.raw.data.hostId = lounge.userId
        // this
      }
      await next()
    },
  ]

  #hostId: number | undefined

  getPresenceInfo(socket: AuthenticatedSocket<PublicUser>): PresenceInfo {
    const { id, ...data } = socket.getUserOrFail()

    return {
      id: id.toString(),
      data,
    }
  }

  // Support asking resync when the user connects (even on another client)
  async onJoin(socket: AuthenticatedSocket<PublicUser>) {
    // Read lounge only once and set it
    if (!this.#hostId) {
      const lounge = await Lounge.find(this.params.id)
      this.#hostId = lounge?.userId
    }

    this.broadcastExcept(socket.id, 'lounge:resync', null)
  }

  async onLeave() {
    // If lounge channel is empty, delete Lounge
    const count = await this.presence.count(this.channelName)
    if (count === 0) {
      await Lounge.query().where('id', this.params.id).delete()
    }
  }

  @onMessage('lounge:host')
  async sendHost(): Promise<number | undefined> {
    return this.#hostId
  }

  @onMessage('lounge:sync')
  async syncTimer(
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
