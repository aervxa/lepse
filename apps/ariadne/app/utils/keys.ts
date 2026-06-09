import type { InjectionKey } from 'vue'

export const focusMethodToggleableKey = Symbol('focus-method-toggleable') as InjectionKey<
  Ref<boolean>
>
