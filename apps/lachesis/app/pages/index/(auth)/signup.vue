<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField, useFieldError } from 'vee-validate'
import { z } from 'zod'
import { toast } from 'vue-sonner'

definePageMeta({ overlay: true })

const { signup } = useAuth()

const formSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  })

const { handleSubmit, setFieldError, isSubmitting } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: { name: '', email: '', password: '', passwordConfirmation: '' },
})

const pwError = useFieldError('password')
const confirmError = useFieldError('passwordConfirmation')

const onSubmit = handleSubmit(async (values) => {
  const error = await signup(
    values.name || '',
    values.email,
    values.password,
    values.passwordConfirmation
  )
  if (error?.isValidationError()) {
    const errors = mapErrors(error.response.errors)
    if (errors.name) setFieldError('name', errors.name.message)
    if (errors.email) setFieldError('email', errors.email.message)
    if (errors.password) setFieldError('password', errors.password.message)
    if (errors.passwordConfirmation)
      setFieldError('passwordConfirmation', errors.passwordConfirmation.message)
  } else if (error) {
    toast.error('Something went wrong', { description: error.message })
  } else {
    toast.success('Signed up successfully')
    navigateTo('/')
  }
})
</script>

<template>
  <DialogHeader class="text-center">
    <DialogTitle class="text-xl">Create your account</DialogTitle>
    <DialogDescription>Enter your details below to create your account</DialogDescription>
  </DialogHeader>
  <form @submit="onSubmit">
    <FieldGroup>
      <!-- Name -->
      <VeeField v-slot="{ field, errors }" name="name">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="name">Name</FieldLabel>
          <Input
            id="name"
            v-bind="field"
            placeholder="Laughing Fox"
            :aria-invalid="!!errors.length"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <!-- Email -->
      <VeeField v-slot="{ field, errors }" name="email">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="email">Email</FieldLabel>
          <Input
            id="email"
            v-bind="field"
            type="email"
            autocomplete="username"
            placeholder="me@gmail.com"
            :aria-invalid="!!errors.length"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <!-- Passwords -->
      <Field>
        <div class="grid grid-cols-2 gap-4 @max-xs:grid-cols-1">
          <VeeField v-slot="{ field, errors }" name="password">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                v-bind="field"
                autocomplete="new-password"
                :aria-invalid="!!errors.length"
              />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="passwordConfirmation">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="passwordConfirmation">Confirm Password</FieldLabel>
              <Input
                id="passwordConfirmation"
                type="password"
                v-bind="field"
                autocomplete="new-password"
                :aria-invalid="!!errors.length"
              />
            </Field>
          </VeeField>
        </div>

        <!-- Shared error block for both password fields -->
        <FieldError v-if="pwError || confirmError">
          {{ pwError || confirmError }}
        </FieldError>
        <FieldDescription v-else>Must be at least 8 characters long.</FieldDescription>
      </Field>

      <!-- Submit -->
      <Field>
        <Button type="submit" class="w-full" :disabled="isSubmitting">Create Account</Button>
        <p class="text-muted-foreground text-center text-sm">
          Already have an account?
          <NuxtLink to="/login" class="text-foreground underline">Login</NuxtLink>
        </p>
      </Field>
    </FieldGroup>
  </form>
</template>
