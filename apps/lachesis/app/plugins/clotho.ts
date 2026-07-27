import { createTuyau } from '@tuyau/core/client'
import { registry } from '@lepse/clotho/registry'
import { toast } from 'vue-sonner'
import { formatTimeAgo } from '@vueuse/core'

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
        afterResponse: [
          (request, _, response) => {
            if (response.status === 429) {
              toast.error('Alright, you gotta chill -_-', {
                description: 'You got rate limited. Retry again later.',
              })
            }
          },
        ],
      },
    })

    return { provide: { clotho } }
  },
})
