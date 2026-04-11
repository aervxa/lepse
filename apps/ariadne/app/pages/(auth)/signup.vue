<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField, useFieldError } from 'vee-validate'
import { z } from 'zod'
import { Eye } from 'lucide-vue-next'
import { useAuth } from '~/composables/useAuth'
import { toast } from 'vue-sonner'
import { mapErrors } from '~/lib/utils'

const { signup } = useAuth()

const formSchema = z
  .object({
    fullName: z.string().optional(),
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
  initialValues: { fullName: '', email: '', password: '', passwordConfirmation: '' },
})

const pwError = useFieldError('password')
const confirmError = useFieldError('passwordConfirmation')

const onSubmit = handleSubmit(async (values) => {
  const error = await signup(
    values.fullName || '',
    values.email,
    values.password,
    values.passwordConfirmation
  )
  if (error?.isValidationError()) {
    const errors = mapErrors(error.response.errors)
    if (errors.fullName) setFieldError('fullName', errors.fullName.message)
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
          <CardTitle class="text-xl">Create your account</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit="onSubmit">
            <FieldGroup>
              <!-- Full Name -->
              <VeeField v-slot="{ field, errors }" name="fullName" :validate-on-input="false">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel for="fullName">Full Name</FieldLabel>
                  <Input
                    id="fullName"
                    v-bind="field"
                    placeholder="Laughing Fox"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>

              <!-- Email -->
              <VeeField v-slot="{ field, errors }" name="email" :validate-on-input="false">
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
                  <VeeField v-slot="{ field, errors }" name="password" :validate-on-input="false">
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

                  <VeeField
                    v-slot="{ field, errors }"
                    name="passwordConfirmation"
                    :validate-on-input="false"
                  >
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
                <Button type="submit" class="w-full" :disabled="isSubmitting"
                  >Create Account</Button
                >
                <p class="text-muted-foreground text-center text-sm">
                  Already have an account?
                  <a href="/login" class="text-foreground underline">Login</a>
                </p>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
