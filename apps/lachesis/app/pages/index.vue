<script setup lang="ts">
import {
  CircleAlert,
  Copy,
  Expand,
  Lightbulb,
  LightbulbOff,
  MoreHorizontal,
  Shrink,
} from '@lucide/vue'
import { useFullscreen, useLocalStorage, useWindowSize } from '@vueuse/core'
import { toast } from 'vue-sonner'
import EmailVerifyButton from '~/components/email-verify-button.vue'
import { getDailyQuote } from '~/lib/quotes'

definePageMeta({
  layout: 'shell',
})

const route = useRoute()
const { user } = useAuth()

const inFocus = ref(false)
const focusMethod = useLocalStorage<'stopwatch' | 'pomodoro'>('focus_method', 'stopwatch')
const focusMethodToggleable = ref(true)
provide(focusMethodToggleableKey, focusMethodToggleable)
provide(enterFocusKey, () => {
  inFocus.value = true
})
const focusDirty = ref(false)
provide(focusDirtyKey, focusDirty)
const toggleFocusMethod = () => {
  const r = () => (focusMethod.value = focusMethod.value === 'stopwatch' ? 'pomodoro' : 'stopwatch')
  if (focusDirty.value) {
    dialog({ title: 'Are you sure?', description: 'Switching will reset your timer.' }).then(
      (v) => v && r()
    )
  } else {
    r()
  }
}
const toggleFocus = () => {
  const r = () => (inFocus.value = !inFocus.value)
  if (focusDirty.value) {
    dialog({ title: 'Are you sure?', description: 'Leaving will reset your timer.' }).then(
      (v) => v && r()
    )
  } else {
    r()
  }
}

const {
  isFullscreen,
  isSupported: isFullscreenSupported,
  toggle: toggleFullscreen,
} = useFullscreen()

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
        <SettingsDialog />
      </template>
      <div v-else class="flex gap-2">
        <Button variant="outline" @click="navigateTo('/signup')">Sign Up</Button>
        <Button @click="navigateTo('/login')">Login</Button>
      </div>

      <Item
        v-if="!user || !user.emailVerified"
        variant="outline"
        class="bg-card/80 absolute top-full right-0 -z-10 w-max translate-y-3 backdrop-blur-lg rtl:left-0"
      >
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
    </div>
  </div>

  <!-- Center | clock -->
  <ClockFocus :in-focus :focus-method />

  <!-- Footer | actions -->
  <div class="flex h-16 items-end justify-between gap-4">
    <BubbleNav />
    <ContextMenu>
      <ContextMenuTrigger as-child>
        <p
          ref="quote"
          class="fixed-color-clock:text-foreground text-foreground-fixed sm:from-background/40 sm:via-background/20 via-background/40 -m-2 w-[28ch] max-w-[80%] rounded-xs bg-linear-to-r from-transparent to-transparent px-3 py-2 text-lg font-medium text-pretty italic opacity-80 backdrop-blur-sm max-sm:absolute max-sm:bottom-1/5 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:translate-y-1/2 max-sm:text-center sm:rounded-bl-2xl sm:text-xl 2xl:text-2xl 2xl:font-semibold rtl:bg-linear-to-l sm:rtl:rounded-br-2xl"
        >
          "{{ getDailyQuote() }}"
        </p>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem @select="copyQuote">
          <Copy />
          Copy
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>

    <div class="flex gap-2">
      <Button
        :variant="inFocus ? 'secondary' : 'default'"
        :size="width < 448 ? 'icon' : undefined"
        class="font-mono text-[11px] tracking-widest uppercase"
        @click="toggleFocus"
      >
        <LightbulbOff v-if="inFocus" />
        <Lightbulb v-else />
        <span class="max-2xs:sr-only">{{ inFocus ? 'Exit' : 'Focus' }}</span>
      </Button>
      <template v-if="width >= 512">
        <Button
          v-if="inFocus"
          variant="outline"
          class="-order-1 font-mono text-[10px] tracking-widest uppercase"
          @click="toggleFocusMethod"
          :disabled="!focusMethodToggleable"
        >
          {{ focusMethod === 'stopwatch' ? 'Pomodoro' : 'Stopwatch' }}
        </Button>
        <Button v-if="isFullscreenSupported" variant="ghost" size="icon" @click="toggleFullscreen">
          <Shrink v-if="isFullscreen" />
          <Expand v-else />
        </Button>
      </template>
      <template v-else>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button size="icon" variant="outline">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @select="toggleFocusMethod" :disabled="!focusMethodToggleable">
              Use {{ focusMethod === 'pomodoro' ? 'Stopwatch' : 'Pomodoro' }}
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
