import { createTuyau } from '@tuyau/core/client'
import { registry } from '@lepse/clotho/registry'

export default defineNuxtPlugin({
  name: 'clotho',
  async setup() {
    const config = useRuntimeConfig()
    const token = useCookie('auth_token')

    const clotho = createTuyau({
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

    return { provide: { clotho } }
  },
})
