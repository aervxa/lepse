<script setup lang="ts">
import { useForm, Field as VeeField } from 'vee-validate'
import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { mapErrors } from '~/lib/utils'
import { toast } from 'vue-sonner'
import { RotateCcw } from 'lucide-vue-next'

const props = defineProps<{
  taskId?: number
}>()

const { tasks, createTask, updateTask } = useTasks()

const task = computed(() => tasks.value.find((t) => t.id === props.taskId))

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(2500).optional(),
  priority: z.enum(['none', 'low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['todo', 'in_progress', 'done', 'canceled']).optional(),
  timeEstimateMin: z.coerce.number().min(0).optional(),
  deadline: z.string().optional(),
})

const { handleSubmit, setFieldError, isSubmitting, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    name: task.value?.name,
    description: task.value?.description || undefined,
    // @ts-expect-error | type is set as string due to json serialization from server
    priority: task.value?.priority || 'none',
    // @ts-expect-error | type is set as string due to json serialization from server
    status: task.value?.status || 'todo',
    deadline: task.value?.deadline || undefined,
    timeEstimateMin: task.value?.timeEstimateMin || undefined,
  },
})

const onSubmit = handleSubmit(async (values) => {
  const error = task.value ? await updateTask(task.value.id, values) : await createTask(values)
  if (error?.isValidationError()) {
    const errors = mapErrors(error.response.errors)
    for (const [field, err] of Object.entries(errors)) {
      setFieldError(field as any, err.message)
    }
  } else if (error) {
    toast.error('Something went wrong', { description: error.message })
  } else {
    toast.success('Task ' + (task.value ? 'updated' : 'created'))
    useRouter().back()
  }
})
</script>

<template>
  <form class="contents" @submit="onSubmit">
    <DialogHeader>
      <DialogTitle>{{ task ? 'Edit' : 'New' }} Task</DialogTitle>
      <DialogDescription>
        {{ task ? `Update details for: ${task.name}` : 'What are we focusing on today?' }}
      </DialogDescription>
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

      <!-- Priority + Status -->
      <FieldGroup class="flex-row @max-xs:contents">
        <VeeField v-slot="{ field, errors }" name="priority">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="priority">Priority</FieldLabel>
            <Select :model-value="field.value" @update:model-value="field.onChange">
              <SelectTrigger id="priority" class="h-10" :aria-invalid="!!errors.length">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
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
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
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
      <Button
        v-if="task"
        type="button"
        size="icon"
        variant="ghost"
        class="mr-auto max-sm:hidden"
        @click="resetForm"
      >
        <RotateCcw />
      </Button>
      <Button variant="outline" type="button" @click="navigateTo('/app/tasks')"> Cancel </Button>
      <Button type="submit" :disabled="isSubmitting || !meta.dirty || !meta.valid">
        {{ task ? 'Save' : 'Create Task' }}
      </Button>
    </DialogFooter>
  </form>
</template>
