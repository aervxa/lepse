import { LazyStore } from '@tauri-apps/plugin-store'
import { isTauri } from '@tauri-apps/api/core'

export const useStore = <T>(key: string, defaultValue: T) => {
  if (!isTauri()) return undefined

  const store = new LazyStore('settings.json')
  const state = useState<T>(key) // raw value

  // initialize value only once
  callOnce(`init-${key}`, async () => {
    state.value = (await store.get<T>(key)) ?? defaultValue
  })

  // reactive value with setter
  return computed({
    get: () => state.value,
    set: (v) => {
      state.value = v
      store.set(key, v)
    },
  })
}
