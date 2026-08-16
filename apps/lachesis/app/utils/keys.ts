import type { InjectionKey } from 'vue'

export const focusDirtyKey = Symbol('focus-dirty') as InjectionKey<Ref<boolean>>
export const enterFocusKey = Symbol('enter-focus') as InjectionKey<() => void>
export const focusMethodToggleableKey = Symbol('focus-method-toggleable') as InjectionKey<
  Ref<boolean>
>

export const bubbleNavSourceKey = Symbol('bubble-nav-source') as InjectionKey<
  Ref<'drawer' | 'popover'>
>
