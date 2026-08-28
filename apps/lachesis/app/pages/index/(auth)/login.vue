<script setup lang="ts">
import { revalidateLogic, useForm } from '@tanstack/vue-form'
import { toast } from 'vue-sonner'
import { z } from 'zod'

definePageMeta({ overlay: true })

const { loginMutation } = useAuth()

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
      let validationError = null

      await loginMutation
        .mutateAsync(
          { body: { email: value.email, password: value.password } },
          {
            onError: (err) => {
              if (err.isValidationError()) {
                const errors = mapErrors(err.response.errors)
                validationError = {
                  fields: {
                    email: errors.email?.message,
                    password: errors.password?.message,
                  },
                }
              } else {
                if (err.isStatus(400)) toast.error('Invalid credentials!')
                else toast.error('Something went wrong!', { description: err.message })
                validationError = 'Login failed!'
              }
            },
          }
        )
        .catch(() => {})

      return validationError
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
          <div class="flex items-center justify-between">
            <FieldLabel :for="field.name">Password</FieldLabel>
            <NuxtLink
              to="/reset-password"
              class="text-muted-foreground text-xs tracking-wide underline"
            >
              Forget your password?
            </NuxtLink>
          </div>
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
