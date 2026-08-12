<script setup lang="ts">
import { revalidateLogic, useForm } from '@tanstack/vue-form'
import { toast } from 'vue-sonner'
import { z } from 'zod'

definePageMeta({ overlay: true })

const { signup } = useAuth()

const schema = z
  .object({
    name: z.string(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
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
      const error = await signup(
        value.name,
        value.email,
        value.password,
        value.passwordConfirmation
      )
      if (!error) return null
      if (error.isValidationError()) {
        const errors = mapErrors(error.response.errors)
        return {
          fields: {
            name: errors.name?.message,
            email: errors.email?.message,
            password: errors.password?.message,
            passwordConfirmation: errors.passwordConfirmation?.message,
          },
        }
      } else toast.error('Something went wrong', { description: error.message })
      return 'Signup failed!'
    },
  },
  defaultValues: { name: '', email: '', password: '', passwordConfirmation: '' },
  onSubmit: () => {
    toast.success('Signed up successfully')
    navigateTo('/')
  },
})
</script>

<template>
  <DialogHeader class="text-center">
    <DialogTitle class="text-xl">Create your account</DialogTitle>
    <DialogDescription>Enter your details below to create your account</DialogDescription>
  </DialogHeader>
  <form @submit.prevent="handleSubmit">
    <FieldGroup>
      <!-- Name -->
      <FormField name="name" v-slot="{ field }">
        <Field :data-invalid="!field.state.meta.isValid">
          <FieldLabel :for="field.name">Name</FieldLabel>
          <Input
            :id="field.name"
            :name="field.name"
            :model-value="field.state.value"
            :aria-invalid="!field.state.meta.isValid"
            placeholder="Laughing Fox"
            @blur="field.handleBlur"
            @input="field.handleChange($event.target.value)"
          />
          <FieldError v-if="!field.state.meta.isValid" :errors="field.state.meta.errors" />
        </Field>
      </FormField>

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

      <!-- Passwords -->
      <Field>
        <div class="grid grid-cols-2 gap-4 @max-xs:grid-cols-1">
          <FormField name="password" v-slot="{ field }">
            <Field :data-invalid="!field.state.meta.isValid">
              <FieldLabel :for="field.name">Password</FieldLabel>
              <Input
                type="password"
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                :aria-invalid="!field.state.meta.isValid"
                autocomplete="new-password"
                @blur="field.handleBlur"
                @input="field.handleChange($event.target.value)"
              />
            </Field>
          </FormField>

          <FormField name="passwordConfirmation" v-slot="{ field }">
            <Field :data-invalid="!field.state.meta.isValid">
              <FieldLabel :for="field.name">Confirm Password</FieldLabel>
              <Input
                type="password"
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                :aria-invalid="!field.state.meta.isValid"
                autocomplete="new-password"
                @blur="field.handleBlur"
                @input="field.handleChange($event.target.value)"
              />
            </Field>
          </FormField>
        </div>

        <!-- Shared error block for both password fields -->
        <FormSubscribe v-slot="{ fieldMeta }">
          <FieldError
            v-if="!fieldMeta.password?.isValid || !fieldMeta.passwordConfirmation?.isValid"
            :errors="[
              ...(fieldMeta.password?.errors ?? []),
              ...(fieldMeta.passwordConfirmation?.errors ?? []),
            ]"
          />
          <FieldDescription v-else>Must be at least 8 characters long.</FieldDescription>
        </FormSubscribe>
      </Field>

      <!-- Submit -->
      <FormSubscribe v-slot="{ canSubmit, isPristine, isSubmitting }">
        <Field>
          <LoadingButton type="submit" :disabled="!canSubmit || isPristine" :loading="isSubmitting">
            Create Account
          </LoadingButton>
          <p class="text-muted-foreground text-center text-sm">
            Already have an account?
            <NuxtLink to="/login" class="text-foreground underline">Login</NuxtLink>
          </p>
        </Field>
      </FormSubscribe>
    </FieldGroup>
  </form>
</template>
