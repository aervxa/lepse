<script setup lang="ts">
import { revalidateLogic, useForm } from '@tanstack/vue-form'
import { toast } from 'vue-sonner'
import { z } from 'zod'

definePageMeta({ overlay: true })

const { login } = useAuth()

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
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
      const error = await login(value.email, value.password)
      if (!error) return null
      if (error.isValidationError()) {
        const errors = mapErrors(error.response.errors)
        return {
          fields: {
            email: errors.email?.message,
            password: errors.password?.message,
          },
        }
      } else if (error.isStatus(400)) toast.error('Invalid credentials!')
      else toast.error('Something went wrong', { description: error.message })
      return 'Login failed!'
    },
  },
  defaultValues: { email: '', password: '' },
  onSubmit: () => {
    toast.success('Logged in successfully')
    navigateTo('/')
  },
})
</script>

<template>
  <DialogHeader class="text-center">
    <DialogTitle class="text-xl">Welcome back</DialogTitle>
    <DialogDescription>Login with your email and password.</DialogDescription>
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

      <!-- Password -->
      <FormField name="password" v-slot="{ field }">
        <Field :data-invalid="!field.state.meta.isValid">
          <FieldLabel :for="field.name">Password</FieldLabel>
          <Input
            type="password"
            :id="field.name"
            :name="field.name"
            :model-value="field.state.value"
            :aria-invalid="!field.state.meta.isValid"
            autocomplete="current-password"
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
            Login
          </LoadingButton>
          <p class="text-muted-foreground text-center text-sm">
            Don't have an account?
            <NuxtLink to="/signup" class="text-foreground underline">Sign up</NuxtLink>
          </p>
        </Field>
      </FormSubscribe>
    </FieldGroup>
  </form>
</template>
