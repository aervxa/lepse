<script setup lang="ts">
import { useCountdown } from '@vueuse/core'
import { toast } from 'vue-sonner'

const emits = defineEmits(['success'])

const { requestEmailVerificationMutation } = useAuth()
const { remaining, start, reset } = useCountdown(60)
const hasReset = ref(false)

const request = () => {
  return requestEmailVerificationMutation.mutateAsync(
    {},
    {
      onSuccess: () => {
        toast.success('Sent!', { description: 'please check your email!' })
        reset()
        hasReset.value = true
        start()
        emits('success')
      },
      onError: (err) => {
        toast.error('Something went wrong', { description: err.message })
      },
    }
  )
}

onMounted(() => {
  start()
})

const lucky = Math.random() < 0.04
</script>

<template>
  <LoadingButton :disabled="remaining > 0" :action="request" force-slot>
    {{
      remaining
        ? `${hasReset ? 'Resend' : lucky ? 'Sned lnik' : 'Send link'} in ${remaining}s`
        : hasReset
          ? 'Resend'
          : lucky
            ? 'Sned lnik'
            : 'Send link'
    }}
  </LoadingButton>
</template>
