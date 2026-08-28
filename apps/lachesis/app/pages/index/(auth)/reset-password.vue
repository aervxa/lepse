<script setup lang="ts">
import { revalidateLogic, useForm } from '@tanstack/vue-form'
import { toast } from 'vue-sonner'
import { z } from 'zod'

definePageMeta({ overlay: true })

const { requestPasswordResetMutation } = useAuth()

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

const {
  handleSubmit,
  Field: FormField,
  Subscribe: FormSubscribe,
} = useForm({
  validationLogic: revalidateLogic(),
  validators: {
    onDynamic: schema,
    onSubmitAsync: async ({ value }) => {
      let validationError = null

      await requestPasswordResetMutation.mutateAsync(
        { body: { email: value.email } },
        {
          onError: (err) => {
            if (err.isValidationError()) {
              const errors = mapErrors(err.response.errors)
              validationError = {
                fields: {
                  email: errors.email?.message,
                },
              }
            } else {
              if (err.isStatus(404)) {
                toast.error('Something went wrong!', {
                  description: 'Please check the email address you entered.',
                })
              } else toast.error('Something went wrong!', { description: err.message })
              validationError = 'Password reset request failed!'
            }
          },
        }
      )

      return validationError
    },
  },
  defaultValues: { email: '' },
  onSubmit: () => {
    toast.success('Password reset link sent!')
    navigateTo('/login')
  },
})
</script>

<template>
  <DialogHeader class="text-center">
    <DialogTitle class="text-xl">Welp, Reset password</DialogTitle>
    <DialogDescription>Send a password reset link to your email.</DialogDescription>
  </DialogHeader>
  <form @submit.prevent="handleSubmit">
    <FieldGroup>
      <!-- Email -->
      <FormField name="email" v-slot="{ field }">
        <Field :data-invalid="!field.state.meta.isValid">
          <FieldLabel :for="field.name">Email</FieldLabel>
          <Input
            type="email"
            :id="field.name"
            :name="field.name"
            :model-value="field.state.value"
            :aria-invalid="!field.state.meta.isValid"
            autocomplete="username"
            placeholder="me@gmail.com"
            @blur="field.handleBlur"
            @input="field.handleChange($event.target.value)"
          />
          <FieldError v-if="!field.state.meta.isValid" :errors="field.state.meta.errors" />
        </Field>
      </FormField>

      <!-- Submit -->
      <FormSubscribe v-slot="{ canSubmit, isPristine, isSubmitting }">
        <Field>
          <LoadingButton type="submit" :disabled="!canSubmit || isPristine" :loading="isSubmitting">
            Reset password
          </LoadingButton>
          <p class="text-muted-foreground text-center text-sm">
            Know your password?
            <NuxtLink to="/login" class="text-foreground underline">Login</NuxtLink>
          </p>
        </Field>
      </FormSubscribe>
    </FieldGroup>
  </form>
</template>
