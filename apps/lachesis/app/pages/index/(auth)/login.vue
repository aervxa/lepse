<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { z } from 'zod'
import { Eye } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

definePageMeta({ overlay: true })

const { login } = useAuth()

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

const { handleSubmit, setFieldError, isSubmitting } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: { email: '', password: '' },
})

const onSubmit = handleSubmit(async (values) => {
  const error = await login(values.email, values.password)
  if (error?.isValidationError()) {
    const errors = mapErrors(error.response.errors)

    if (errors.email) setFieldError('email', errors.email.message)
    if (errors.password) setFieldError('password', errors.password.message)
  } else if (error?.isStatus(400)) {
    toast.error('Invalid credentials!')
  } else if (error) {
    toast.error('Something went wrong', { description: error.message })
  } else {
    toast.success('Logged in successfully')
    navigateTo('/')
  }
})
</script>

<template>
  <DialogHeader class="text-center">
    <DialogTitle class="text-xl">Welcome back</DialogTitle>
    <DialogDescription>Login with your email and password.</DialogDescription>
  </DialogHeader>
  <form @submit="onSubmit">
    <FieldGroup>
      <!-- Email -->
      <VeeField v-slot="{ field, errors }" name="email">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            v-bind="field"
            autocomplete="username"
            placeholder="me@gmail.com"
            :aria-invalid="!!errors.length"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <!-- Password -->
      <VeeField v-slot="{ field, errors }" name="password">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            v-bind="field"
            autocomplete="current-password"
            :aria-invalid="!!errors.length"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <!-- Submit -->
      <Field>
        <Button type="submit" class="w-full" :disabled="isSubmitting">Login</Button>
        <p class="text-muted-foreground text-center text-sm">
          Don't have an account?
          <NuxtLink to="/signup" class="text-foreground underline">Sign up</NuxtLink>
        </p>
      </Field>
    </FieldGroup>
  </form>
</template>
