<script setup lang="ts">
import {
  CircleAlert,
  Copy,
  Expand,
  Lightbulb,
  LightbulbOff,
  MoreHorizontal,
  Settings,
  Shrink,
  SquareArrowOutUpRight,
  X,
} from '@lucide/vue'
import { invoke, isTauri } from '@tauri-apps/api/core'
import { listen, type UnlistenFn } from '@tauri-apps/api/event'
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
import { TuyauHTTPError } from '@tuyau/core/client'
import { onKeyStroke, StorageSerializers, useLocalStorage, useWindowSize } from '@vueuse/core'
import EmailVerifyButton from '~/components/email-verify-button.vue'

definePageMeta({
  layout: 'shell',
})

const route = useRoute()
const { user, logoutMutation } = useAuth()
const { $queryClient, $api } = useNuxtApp()
const { activeQuote } = useQuote()

// Refetch to bypass userQuery and logout if server responds with a 401 and user value exists
$queryClient
  .fetchQuery($api.account.profile.show.queryOptions(undefined, { retry: 0 }))
  .catch((error) => {
    error instanceof TuyauHTTPError &&
      error.isStatus(401) &&
      user.value &&
      logoutMutation.mutate({})
  })

const ignoreLogin = ref(false)

useFocusSyncServer()
const inFocus = ref(false)
const enterFocus = () => {
  toggleFocus(true)
}
provide(enterFocusKey, enterFocus)
const focusRef = useTemplateRef('focus')
const focusDirty = useLocalStorage('focus_dirty', false) // from clock-focus
const focusHandoff = useLocalStorage<FocusHandoff>('focus_handoff', null, {
  serializer: StorageSerializers.object,
})
let forceExit = false
const toggleFocus = (value?: boolean) => {
  // Value is the NEW value
  value = value ?? !inFocus.value
  const r = () => {
    forceExit = true // set forceExit to true so listener for re-enter can ignore and not re-enter
    focusHandoff.value = null // empty handoff
    inFocus.value = value
  }

  if (!value /* when trying to close */) {
    if (focusDirty.value) {
      dialog({ title: 'Are you sure?', description: 'Leaving will reset your timer.' }).then(
        (v) => v && r()
      )
    } else {
      r()
    }
  } else /* trying to open */ {
    if (isPopoutOpen.value) {
      openPopout()
    } else {
      r()
    }
  }
}

const {
  isFullscreen,
  isSupported: isFullscreenSupported,
  toggle: toggleFullscreen,
  exit: exitFullscreen,
} = useFullscreen()

onKeyStroke('F11', (e) => {
  e.preventDefault()
  toggleFullscreen()
})
onKeyStroke('Escape', () => {
  // browsers already do this, but no harm
  if (isFullscreen.value) exitFullscreen()
})

const quote = useTemplateRef('quote')
const copyQuote = async () => {
  try {
    if (!quote.value?.innerText) throw new Error('no quote elm')
    await navigator.clipboard.writeText(quote.value.innerText)
    toast.success('Quote copied!')
  } catch {
    toast.error("Couldn't copy quote :(")
  }
}

const { width } = useWindowSize()

const isApp = ref(false)
const isPopoutOpen = useLocalStorage('popout-open', false) // localstorage so state persist through window reloads

let unlistenPopout: UnlistenFn
onMounted(async () => {
  isApp.value = isTauri()

  if (isApp.value) {
    isPopoutOpen.value = !!(await (await WebviewWindow.getByLabel('popout'))?.isVisible())
    unlistenPopout = await listen<boolean>('popout-open', ({ payload }) => {
      isPopoutOpen.value = payload
    })
  }
})
onUnmounted(() => {
  unlistenPopout?.()
})

// Listener for when to exit focus
watch(isPopoutOpen, () => {
  if (isPopoutOpen.value) {
    inFocus.value = false
  }
})

// Listener for when to re-enter focus
watch(focusHandoff, (v) => {
  // If forceExit (user asked to exit), don't re-enter
  if (forceExit) {
    forceExit = false // clear state
  } else if (v && v.elapsed > 0 && !isPopoutOpen.value) {
    console.log('[clock-focus:main] found handoff. entering focus...')
    inFocus.value = true
  }
})

const openPopout = () => {
  if (isApp.value) {
    invoke('open_popout')
  }
}
</script>

<template>
  <!-- Header | logo -->
  <div class="flex h-16 items-start justify-between gap-8">
    <Logo />
    <div
      class="relative flex items-start gap-4"
      :class="[
        user?.emailVerified &&
          'from-background/40 via-background/20 -m-2 rounded-xs rounded-tr-2xl bg-linear-to-l to-transparent p-2 ps-3 backdrop-blur-sm rtl:rounded-tl-2xl rtl:bg-linear-to-r',
      ]"
    >
      <template v-if="user">
        <FocusSessions v-if="user.emailVerified" />
        <EmailVerifyButton v-else class="-mr-2" />
        <Profile />
      </template>
      <div v-else class="flex gap-2">
        <Button variant="outline" @click="navigateTo('/signup')">Sign Up</Button>
        <Button @click="navigateTo('/login')">Login</Button>
        <Button variant="outline" size="icon" aria-label="Open settings" as-child>
          <NuxtLink to="/settings">
            <Settings />
          </NuxtLink>
        </Button>
      </div>
      <SettingsDialog />

      <Transition
        leave-active-class="animate-out ltr:slide-out-to-right-100 rtl:slide-out-to-left-100"
      >
        <Item
          v-if="!ignoreLogin && (!user || !user.emailVerified)"
          variant="outline"
          class="bg-card/80 absolute top-full right-0 w-max translate-y-3 backdrop-blur-lg rtl:left-0"
        >
          <div
            class="absolute top-0 left-0 -translate-y-1/3 ltr:-translate-x-1/3 rtl:right-0 rtl:translate-x-1/3"
          >
            <Button
              variant="secondary"
              size="icon-xs"
              @click="ignoreLogin = true"
              aria-label="close login hint"
            >
              <X />
            </Button>
          </div>
          <ItemMedia variant="icon">
            <CircleAlert />
          </ItemMedia>
          <ItemContent class="mr-2">
            <ItemTitle>
              {{
                !user
                  ? 'Login to unlock all features!'
                  : !user?.emailVerified && 'Verify your email to unlock all features!'
              }}
            </ItemTitle>
            <ItemDescription>
              {{
                !user
                  ? 'You can create an account too.'
                  : !user?.emailVerified && 'Check if we already sent you a link'
              }}
            </ItemDescription>
          </ItemContent>
        </Item>
      </Transition>
    </div>
  </div>

  <!-- Center | clock -->
  <Clock v-if="!inFocus" />
  <ClockFocus v-else ref="focus" />

  <!-- Footer | actions -->
  <div class="flex h-16 items-end justify-between gap-4">
    <BubbleNav />
    <ContextMenu>
      <ContextMenuTrigger as-child>
        <p
          ref="quote"
          class="fixed-color-clock:text-foreground text-foreground-fixed sm:from-background/40 sm:via-background/20 via-background/40 -m-2 w-[28ch] max-w-[80%] rounded-xs bg-linear-to-r from-transparent to-transparent px-3 py-2 text-lg font-medium text-pretty italic opacity-80 backdrop-blur-sm max-sm:absolute max-sm:bottom-1/5 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:translate-y-1/2 max-sm:text-center sm:rounded-bl-2xl sm:text-xl 2xl:text-2xl 2xl:font-semibold rtl:bg-linear-to-l sm:rtl:rounded-br-2xl"
        >
          "{{ activeQuote.quote }}"
        </p>
      </ContextMenuTrigger>

      <ContextMenuContent align="end">
        <p class="text-muted-foreground px-1.5 py-1 text-xs">Author: {{ activeQuote.author }}</p>
        <ContextMenuSeparator />

        <ContextMenuItem @select="copyQuote">
          <Copy />
          Copy quote
        </ContextMenuItem>

        <ContextMenuSeparator />
        <p class="text-muted-foreground px-1.5 py-1 text-xs">
          Quote provided by
          <a :href="activeQuote.credit.url" target="_blank">{{ activeQuote.credit.handle }}</a>
        </p>
      </ContextMenuContent>
    </ContextMenu>

    <div class="flex items-end gap-2">
      <Button
        :variant="inFocus ? 'secondary' : 'default'"
        :size="width < 448 ? 'icon' : undefined"
        class="font-mono text-[11px] tracking-widest uppercase"
        @click="toggleFocus()"
      >
        <SquareArrowOutUpRight v-if="isPopoutOpen" />
        <LightbulbOff v-else-if="inFocus" />
        <Lightbulb v-else />
        <span class="max-2xs:sr-only">{{ inFocus ? 'Exit' : 'Focus' }}</span>
      </Button>
      <template v-if="width >= 512">
        <Button
          v-if="inFocus"
          variant="secondary"
          class="-order-1 font-mono text-[10px] tracking-widest uppercase"
          @click="focusRef?.toggleFocusMethod()"
        >
          {{ focusRef?.focusMethod === 'stopwatch' ? 'Pomodoro' : 'Stopwatch' }}
        </Button>
        <div class="flex flex-col gap-2">
          <Button v-if="isApp && inFocus" variant="ghost" size="icon" @click="openPopout()">
            <SquareArrowOutUpRight />
          </Button>
          <Button
            v-if="isFullscreenSupported"
            variant="ghost"
            size="icon"
            @click="toggleFullscreen"
          >
            <Shrink v-if="isFullscreen" />
            <Expand v-else />
          </Button>
        </div>
      </template>
      <template v-else>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button size="icon" variant="outline" aria-label="more options">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem v-if="inFocus" @select="focusRef?.toggleFocusMethod()">
              Use {{ focusRef?.focusMethod === 'stopwatch' ? 'Pomodoro' : 'Stopwatch' }}
            </DropdownMenuItem>
            <DropdownMenuItem v-if="isApp && inFocus" @select="openPopout()">
              Open popout
            </DropdownMenuItem>
            <DropdownMenuItem v-if="isFullscreenSupported" @select="toggleFullscreen">
              {{ isFullscreen ? 'Exit' : 'Enter' }} Fullscreen
              <DropdownMenuShortcut>F11</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
    </div>
  </div>

  <LoungePeers floating />

  <!-- overrides for overlays that don't have nested routes
       for nested routes, it's own component is better for route handling
   -->
  <Dialog
    v-if="route.meta.overlay"
    open
    @update:open="
      (v) => {
        v || navigateTo('/')
      }
    "
  >
    <DialogContent>
      <NuxtPage />
    </DialogContent>
  </Dialog>
</template>
