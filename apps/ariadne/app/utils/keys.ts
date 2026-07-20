import type { InjectionKey } from 'vue'

export const focusMethodToggleableKey = Symbol('focus-method-toggleable') as InjectionKey<
  Ref<boolean>
>

export const bubbleNavSourceKey = Symbol('bubble-nav-source') as InjectionKey<
  Ref<'drawer' | 'popover'>
>

export const isShellFullscreenKey = Symbol('is-shell-fullscreen') as InjectionKey<Ref<boolean>>
export const toggleShellFullscreenKey = Symbol('toggle-shell-fullscreen') as InjectionKey<
  () => void
>
