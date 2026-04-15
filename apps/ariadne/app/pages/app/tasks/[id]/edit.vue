<script setup lang="ts">
import { useForm, Field as VeeField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { mapErrors } from '~/lib/utils'
import { RotateCcw } from 'lucide-vue-next'

const route = useRoute()
const { tasks, updateTask } = useTasks()

// Reuse already-loaded task from shared state
const task = computed(() => tasks.value.find((t) => t.id === Number(route.params.id)))

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

const { handleSubmit, setFieldError, isSubmitting, resetForm, meta } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: task.value?.name,
    description: task.value?.description || undefined,
    // @ts-expect-error | type is set as string due to json serialization from server
    urgency: task.value?.urgency || 'none',
    // @ts-expect-error | type is set as string due to json serialization from server
    status: task.value?.status || 'todo',
    deadline: task.value?.deadline || undefined,
    timeEstimateMin: task.value?.timeEstimateMin || undefined,
  },
})

const onSubmit = handleSubmit(async (values) => {
  const error = await updateTask(Number(route.params.id), values)
  if (error?.isValidationError()) {
    const errors = mapErrors(error.response.errors)
    for (const [field, err] of Object.entries(errors)) {
      setFieldError(field as any, err.message)
    }
  } else if (error) {
    toast.error('Something went wrong', { description: error.message })
  } else {
    toast.success('Task updated')
    navigateTo('/app/tasks')
  }
})
</script>

<template>
  <Dialog :open="true" @update:open="navigateTo('/app/tasks')">
    <DialogContent>
      <form class="contents" @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update details for: {{ task?.name }}</DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <!-- Name -->
          <VeeField v-slot="{ field, errors }" name="name">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="name">Name *</FieldLabel>
              <Input
                id="name"
                v-bind="field"
                :model-value="field.value"
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
                :model-value="field.value"
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
                  :model-value="field.value"
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
          <Button type="button" variant="ghost" class="mr-auto max-sm:hidden" @click="resetForm">
            <RotateCcw />
          </Button>
          <Button variant="outline" type="button" @click="navigateTo('/app/tasks')">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting || !meta.dirty || !meta.valid">Save</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
