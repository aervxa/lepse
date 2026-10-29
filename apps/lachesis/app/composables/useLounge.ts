import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import type { LoungePeer } from '@lepse/clotho/types'
import type { WatchHandle } from 'vue'

export type LoungePeers = { [key: string]: LoungePeer } // key is id
type Timer = LoungePeer['timer']
type Connection = 'disconnected' | 'connecting' | 'connected'

const LOUNGE_ID_KEY = 'lounge-id'
const LOUNGE_PEERS_KEY = 'lounge-peers'
const LOUNGE_TIMER_KEY = 'lounge-timer'
const LOUNGE_CONNECTION_KEY = 'lounge-connection' // not to be confused with socket connection

/**
 * Lounge client can be initialized as many times as needed
 * all the client does is update localStorage values
 */
export const useLoungeClient = () => {
  const loungeId = useLocalStorage<string | null>(LOUNGE_ID_KEY, null)
  const peers = useLocalStorage<LoungePeers>(LOUNGE_PEERS_KEY, {})
  const timer = useLocalStorage<Timer>(LOUNGE_TIMER_KEY, null)
  const connection = useLocalStorage<Connection>(LOUNGE_CONNECTION_KEY, 'disconnected')

  const join = (id: string) => (loungeId.value = id)
  const leave = () => (loungeId.value = null)

  const sync = (t: Timer) => (timer.value = t)

  return { peers, connection, join, leave, sync }
}

/**
 * There must only be one lounge-server app-wide
 * the server watches localStorage values and handles the channel connection
 *
 * NOTE: createSharedComposable wraps it to avoid mistaken re-init, but it is not intended to be shared
 */
export const useLoungeServer = createSharedComposable(() => {
  const loungeId = useLocalStorage<string | null>(LOUNGE_ID_KEY, null)
  const peers = useLocalStorage<LoungePeers>(LOUNGE_PEERS_KEY, {})
  const timer = useLocalStorage<Timer>(LOUNGE_TIMER_KEY, null)
  const connection = useLocalStorage<Connection>(LOUNGE_CONNECTION_KEY, 'disconnected')

  const { $socket } = useNuxtApp()

  loungeId.value = null // reset connected lounge (to handle with stale connects)
  peers.value = {}
  connection.value = 'disconnected'

  watch(loungeId, (id, _oldId, onCleanup) => {
    // runs before join, or on leave
    peers.value = {}
    connection.value = 'disconnected'

    if (!id) return
    const channel = $socket.channel('lounge/:id', { id })
    const sync = () => channel.send('lounge:sync', { timer: timer.value })
    let handle: WatchHandle | undefined // watch handle that watches timer

    channel
      .here((members) => {
        const list: LoungePeers = {} // new list to remove members that are not here
        for (const m of members) {
          // Add members into new list
          list[m.id] = peers.value[m.id] ?? {
            user: {
              id: Number(m.id),
              name: String(m.name),
              initials: String(m.initials),
              avatarUrl: String(m.avatarUrl),
            },
            timer: null,
          }
        }
        // set new list
        peers.value = list
      })
      .listen('lounge:closed', () => channel.unsubscribe())
      .listen('lounge:resync', sync)
      .listen('lounge:timer', (p) => {
        peers.value[p.user.id] = p // update the whole peer
      })

    connection.value = 'connecting'
    channel
      .subscribe()
      // NOTE: .then never runs after .unsubscribe (pending subscribe is rejected on unsubscribe)
      .then(() => {
        connection.value = 'connected'
        handle = watch(timer, sync) // watch timer, which the client will update and run server sync
        sync() // send timer to server
      })
      .catch((err) => {
        if (!channel.subscribed) return // `.subscribed` is false when the subscribe was rejected due to an unsubscribe
        console.error(err)

        if (err instanceof Error && err.message.startsWith('404')) {
          toast.error('Lounge unavailable! It may have been closed!')
        } else {
          toast.error('Failed to connect to lounge, Please try again later!')
        }

        // reset lounge (lounge reset alr sets connection.value to 'disconnected')
        loungeId.value = null
      })

    // runs before the watch fires again (user leaves or joins another)
    onCleanup(() => {
      handle?.stop()
      channel.unsubscribe()
      peers.value = {}
      connection.value = 'disconnected'
    })
  })
})
