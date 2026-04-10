import { createTuyau } from '@tuyau/core/client'
import { registry } from '@lepse/minos/registry'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const minos = createTuyau({
    baseUrl: config.public.apiUrl,
    registry,
  })

  return { provide: { minos } }
})
