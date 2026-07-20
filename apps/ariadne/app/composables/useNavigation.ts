import { useEventListener } from '@vueuse/core'

export const useNavigation = () => {
  const navigationRef = shallowRef<Navigation>(window.navigation)
  useEventListener(window.navigation, 'navigatesuccess', () => {
    triggerRef(navigationRef)
  })
  return navigationRef
}
