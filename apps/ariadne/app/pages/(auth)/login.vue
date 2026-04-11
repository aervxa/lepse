<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { z } from 'zod'
import { Eye } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { toast } from 'vue-sonner'
import { mapErrors } from '~/lib/utils'

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
  <div class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
    <div class="flex w-full max-w-sm flex-col gap-6">
      <a href="/" class="flex items-center gap-2 self-center font-medium">
        <div
          class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
        >
          <Eye class="size-4" />
        </div>
        Lepse
      </a>

      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit="onSubmit">
            <FieldGroup>
              <!-- Email -->
              <VeeField v-slot="{ field, errors }" name="email" :validate-on-input="false">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel for="email">Email</FieldLabel>
                  <Input
                    id="email"
                    v-bind="field"
                    autocomplete="username"
                    placeholder="me@gmail.com"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>

              <!-- Password -->
              <VeeField v-slot="{ field, errors }" name="password" :validate-on-input="false">
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
                  <a href="/signup" class="text-foreground underline">Sign up</a>
                </p>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
