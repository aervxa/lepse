import type { InjectionKey } from 'vue'

export const enterFocusKey = Symbol('enter-focus') as InjectionKey<() => void>

export const bubbleNavSourceKey = Symbol('bubble-nav-source') as InjectionKey<
  Ref<'drawer' | 'popover'>
>
