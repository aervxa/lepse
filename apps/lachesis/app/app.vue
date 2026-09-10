<script setup lang="ts">
import { focusManager } from '@tanstack/vue-query'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { TuyauHTTPError } from '@tuyau/core/client'
import { onKeyStroke, useFullscreen } from '@vueuse/core'
import { camelCase } from 'change-case'

const { theme, THEME_OPTIONS, themeOptions } = useSettings()
const { toggle: toggleFullscreen } = useFullscreen()
const { $queryClient, $api } = useNuxtApp()
const { user, logoutMutation } = useAuth()

// manage tanstack/vue-query's window focusManger to be handled by tauri
// NOTE: On linux, focusChanged runs as true on blur when using alt+tab? (can be ignored since refetchOnFocus is never enabled for everything or something all the time)
onMounted(() => {
  focusManager.setEventListener((handleFocus) => {
    const unlistenPromise = getCurrentWindow().onFocusChanged(({ payload: focused }) => {
      handleFocus(focused)
    })
    return () => {
      unlistenPromise.then((unlisten) => unlisten())
    }
  })
})

// Refetch to bypass userQuery and logout if server responds with a 401 and user value exists
$queryClient.fetchQuery($api.account.profile.show.queryOptions({}, { retry: 0 })).catch((error) => {
  error instanceof TuyauHTTPError && error.isStatus(401) && user.value && logoutMutation.mutate({})
})

onKeyStroke('F11', (e) => {
  e.preventDefault()
  toggleFullscreen()
})

onMounted(() => {
  watch(
    theme,
    () => {
      window.document.documentElement.dataset.theme = theme.value
    },
    { immediate: true }
  )
  watch(
    themeOptions,
    () => {
      for (const to of THEME_OPTIONS) {
        if (themeOptions.value === to) {
          window.document.documentElement.dataset[camelCase(to.slice(5))] = ''
        } else {
          window.document.documentElement.removeAttribute(to)
        }
      }
    },
    { immediate: true }
  )
})
</script>

<template>
  <TooltipProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </TooltipProvider>
  <Toaster position="top-center" richColors class="font-[inherit]! **:pointer-events-auto" />
  <DialogRenderer />
</template>
