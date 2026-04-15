<script setup lang="ts">
import { useForm, Field as VeeField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { mapErrors } from '~/lib/utils'

const { createTask } = useTasks()

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required').max(255),
    description: z.string().max(2500).optional(),
    urgency: z.enum(['none', 'low', 'medium', 'high']).optional(),
    status: z.enum(['todo', 'in_progress', 'complete']).optional(),
    timeEstimateMin: z.coerce.number().min(0).optional(),
    deadline: z.string().optional(),
  })
)

const { handleSubmit, setFieldError, isSubmitting } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  const error = await createTask(values)
  if (error?.isValidationError()) {
    const errors = mapErrors(error.response.errors)
    for (const [field, err] of Object.entries(errors)) {
      setFieldError(field as any, err.message)
    }
  } else if (error) {
    toast.error('Something went wrong', { description: error.message })
  } else {
    toast.success('Task created')
    navigateTo('/app/tasks')
  }
})
</script>

<template>
  <Dialog :open="true" @update:open="navigateTo('/app/tasks')">
    <DialogContent>
      <form class="contents" @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>What are we focusing on today?</DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <!-- Name -->
          <VeeField v-slot="{ field, errors }" name="name">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="name">Name *</FieldLabel>
              <Input
                id="name"
                v-bind="field"
                placeholder="e.g. Do xyz"
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>

          <!-- Description -->
          <VeeField v-slot="{ field, errors }" name="description">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="description">Description</FieldLabel>
              <Textarea
                id="description"
                v-bind="field"
                rows="3"
                class="resize-none"
                placeholder="Add context..."
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>

          <!-- Urgency + Status -->
          <FieldGroup class="flex-row @max-xs:contents">
            <VeeField v-slot="{ field, errors }" name="urgency">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="urgency">Urgency</FieldLabel>
                <Select :model-value="field.value" @update:model-value="field.onChange">
                  <SelectTrigger id="urgency" class="h-10" :aria-invalid="!!errors.length">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="status">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="status">Status</FieldLabel>
                <Select :model-value="field.value" @update:model-value="field.onChange">
                  <SelectTrigger id="status" class="h-10" :aria-invalid="!!errors.length">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>

          <!-- Deadline + Estimate -->
          <FieldGroup class="flex-row @max-xs:contents">
            <VeeField v-slot="{ field, errors }" name="deadline">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="deadline">Deadline</FieldLabel>
                <DatePicker
                  id="deadline"
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="timeEstimateMin">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="timeEstimateMin">Estimate (min)</FieldLabel>
                <Input
                  id="timeEstimateMin"
                  v-bind="field"
                  type="number"
                  placeholder="25"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" type="button" @click="navigateTo('/app/tasks')">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting">Create Task</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
