import { createTuyau } from '@tuyau/core/client'
import { registry } from '@lepse/minos/registry'
import { getClientDate } from '~/lib/utils'

export default defineNuxtPlugin({
  name: 'minos',
  async setup() {
    const config = useRuntimeConfig()
    const token = useCookie('auth_token')

    const minos = createTuyau({
      baseUrl: config.public.apiUrl,
      registry,
      hooks: {
        beforeRequest: [
          (request) => {
            if (token.value) {
              request.headers.set('Authorization', `Bearer ${token.value}`)
            }
            request.headers.set('x-client-date', getClientDate())
          },
        ],
      },
    })

    return { provide: { minos } }
  },
})
