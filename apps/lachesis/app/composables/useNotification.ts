import { isTauri } from '@tauri-apps/api/core'
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification'
import { useWebNotification } from '@vueuse/core'

export const useNotification = (requestOnMount: boolean = true) => {
  if (isTauri()) {
    const reqPermission = () => {
      isPermissionGranted().then((granted) => {
        if (!granted) requestPermission()
      })
    }

    if (requestOnMount) requestPermission()

    return {
      send: sendNotification,
      requestPermission: reqPermission,
    }
  } else {
    const { show, ensurePermissions } = useWebNotification({ requestPermissions: requestOnMount })

    return {
      send: show,
      requestPermission: () => {
        ensurePermissions()
      },
    }
  }
}
