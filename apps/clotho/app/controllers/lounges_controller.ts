import Lounge from '#models/lounge'
import LoungePolicy from '#policies/lounge_policy'
import LoungeTransformer from '#transformers/lounge_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import socket from '@rlanz/socket/services/main'

export default class LoungesController {
  async store({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const lounge = await Lounge.create({ userId: user.id })

    return serialize(LoungeTransformer.transform(lounge))
  }

  async destroy({ params, bouncer, response }: HttpContext) {
    const lounge = await Lounge.findOrFail(params.id)
    await bouncer.with(LoungePolicy).authorize('destroy', lounge)

    await lounge.delete()
    socket.to(`lounge/${lounge.id}`).emit('lounge:closed', null)

    /**
     * TODO: Force channel members to unsubscribe
     * For now, clients unsubscribe on `lounge:closed`
     * https://github.com/RomainLanz/socket/issues/1
     */

    return response.noContent()
  }
}
