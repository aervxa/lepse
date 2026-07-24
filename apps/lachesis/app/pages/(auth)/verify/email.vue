<script setup lang="ts">
import { useCountdown } from '@vueuse/core'
import { CheckCircle2, LoaderCircle, MailCheck, XCircle } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

definePageMeta({
  validate: (route) => {
    console.log(typeof route.query.token, route.query.token?.length, route.query.token)
    return typeof route.query.token === 'string' && route.query.token.length === 64
  },
})

const route = useRoute()
const token = route.query.token as string

const { user, verifyEmail, verifyEmailRequest } = useAuth()
const isVerifying = ref(false)
const hasVerified = ref(false)
const hasFailed = ref(false)
const { remaining, start } = useCountdown(60)
const hasRequested = ref(false)

onMounted(async () => {
  isVerifying.value = true
  const error = await verifyEmail(token)
  isVerifying.value = false
  if (error) {
    toast.error(error.isStatus(401) ? 'Invalid or expired token.' : 'Failed to verify email.', {
      description: error.message,
    })
    hasFailed.value = true
    user.value && start()
  } else {
    hasVerified.value = true
  }
})

const request = async () => {
  const error = await verifyEmailRequest()
  if (error) {
    toast.error('Failed to send new link!', { description: 'please try again' })
  } else {
    toast.success('New verification link sent!')
    hasRequested.value = true
  }
}
</script>

<template>
  <Empty class="h-dvh">
    <EmptyMedia variant="icon">
      <MailCheck v-if="hasRequested" />
      <XCircle v-else-if="hasFailed" />
      <CheckCircle2 v-else-if="hasVerified" />
      <LoaderCircle v-else-if="isVerifying" />
    </EmptyMedia>
    <EmptyHeader>
      <EmptyTitle class="text-2xl">
        {{
          hasRequested
            ? 'Check your email for the new link!'
            : hasFailed
              ? "Couldn't verify your email!"
              : hasVerified
                ? 'Your email has been verified!'
                : 'Verifying your email...'
        }}
      </EmptyTitle>
      <EmptyDescription>
        {{
          hasVerified || hasRequested
            ? 'You may close this now!'
            : hasFailed
              ? user
                ? `Don't worry, you can request a new link ${remaining > 0 ? `after ${remaining} seconds` : 'now'}`
                : "Don't worry, you can request a new link once ur logged in"
              : 'Please wait a moment'
        }}
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent v-if="!isVerifying">
      <template v-if="user">
        <LoadingButton
          v-if="hasFailed && !hasRequested"
          :disabled="remaining > 0"
          :action="request"
          force-slot
        >
          {{ remaining || 'Request new link' }}
        </LoadingButton>

        <Button v-else-if="hasVerified" variant="secondary" as-child>
          <NuxtLink to="/">Go to Homepage</NuxtLink>
        </Button>
      </template>

      <Button v-else as-child>
        <NuxtLink to="/login">Login</NuxtLink>
      </Button>
    </EmptyContent>
  </Empty>
</template>
