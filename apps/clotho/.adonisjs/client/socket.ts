export interface AppSocket {

  readonly channels: {

    readonly 'lounge/:id': {

      readonly params: {

        readonly 'id': string | number

      }

      readonly channel: typeof import('#channels/lounge_channel').default

      readonly handlers: {

        readonly 'lounge:send': 'sendMessage'

      }

    }

  }

}

