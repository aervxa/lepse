<script setup lang="ts">
import { revalidateLogic, useForm } from '@tanstack/vue-form'
import { toast } from 'vue-sonner'
import { z } from 'zod'

definePageMeta({ overlay: true })

const { passwordResetRequest } = useAuth()

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
      const error = await passwordResetRequest(value.email)
      if (!error) return null
      if (error.isValidationError()) {
        const errors = mapErrors(error.response.errors)
        return {
          fields: {
            email: errors.email?.message,
            password: errors.password?.message,
          },
        }
      } else if (error.isStatus(404))
        toast.error('User not found!', { description: 'Please create a new account.' })
      else toast.error('Something went wrong', { description: error.message })
      return 'Password reset request failed!'
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
