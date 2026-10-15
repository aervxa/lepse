import { persistQueryClientRestore } from '@tanstack/query-persist-client-core'
import { useEventListener } from '@vueuse/core'

export const useCacheSyncQueryClient = () => {
  const { $persistQueryClientProps } = useNuxtApp()

  useEventListener('storage', (e) => {
    if (e.key === QUERY_OFFLINE_CACHE) {
      persistQueryClientRestore($persistQueryClientProps)
    }
  })
}
