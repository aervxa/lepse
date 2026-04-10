import { createTuyau } from '@tuyau/core/client'
import { registry } from '@lepse/minos/registry'

export default defineNuxtPlugin(() => {
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
        },
      ],
    },
  })

  return { provide: { minos } }
})
