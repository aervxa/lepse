import { registry } from '@lepse/clotho/registry'
import { createTuyau } from '@tuyau/core/client'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { focusManager, QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createTuyauVueQueryClient } from '@tuyau/vue-query'
import { toast } from 'vue-sonner'
import { appQueryDefaults } from '~/lib/query-client-options'

export default defineNuxtPlugin({
  name: 'clotho',
  async setup(app) {
    const config = useRuntimeConfig()
    const token = useCookie('auth_token')

    // Refetch opt-in queries when this window becomes active as well as when its tab becomes
    // visible. The verification link is served by Clotho, so the app cannot use a same-origin
    // cache event to notify this window.
    focusManager.setEventListener((onFocus) => {
      if (typeof window === 'undefined') return

      const handleFocus = () => onFocus()
      window.addEventListener('visibilitychange', handleFocus)
      window.addEventListener('focus', handleFocus)

      return () => {
        window.removeEventListener('visibilitychange', handleFocus)
        window.removeEventListener('focus', handleFocus)
      }
    })

    // Use tanstack/vue-query
    // Most refetches are manual to avoid redundant requests. The authenticated profile query
    // opts into focus and mount refetches in useAuth.
    const queryClient = new QueryClient({ defaultOptions: appQueryDefaults })
    app.vueApp.use(VueQueryPlugin, {
      queryClient,
      clientPersister: (queryClient) =>
        persistQueryClient({
          queryClient,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          persister: createAsyncStoragePersister({ storage: localStorage }),
        }),
    })

    // the tuyau client
    const client = createTuyau({
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
          (_request, _options, response) => {
            if (response.status === 429) {
              toast.error('Alright, you gotta chill -_-', {
                description: 'You got rate limited. Retry again later.',
              })
            }
          },
        ],
      },
    })

    // the tuyau vue-query client
    const api = createTuyauVueQueryClient({
      client,
    })

    return {
      provide: {
        queryClient, // queries without context (in plugins for example)
        client, // for overriding and using client directly instead of type safe options
        api, // for type-safe query and mutation options
      },
    }
  },
})
