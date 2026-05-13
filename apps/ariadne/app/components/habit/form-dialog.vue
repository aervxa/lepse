<script setup lang="ts">
import { useForm, Field as VeeField } from 'vee-validate'
import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { mapErrors } from '~/lib/utils'
import { toast } from 'vue-sonner'
import { RotateCcw } from 'lucide-vue-next'

const props = defineProps<{
  habitId?: number
}>()

const { habits, createHabit, updateHabit } = useHabits()

const habit = computed(() => habits.value.find((h) => h.id === props.habitId))

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(2500).optional(),
  frequency: z.enum(['daily', 'weekly']).optional(),
  target: z.number().min(1).optional(),
  reminders: z
    .array(
      z.object({
        day: z.number().min(0).max(6).optional(),
        time: z.string(),
      })
    )
    .optional(),
})

const { handleSubmit, setFieldError, isSubmitting, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    name: habit.value?.name,
    description: habit.value?.description || undefined,
    // @ts-ignore | minos provides string instead of enum due to json-ification
    frequency: habit.value?.frequency || 'daily',
    target: habit.value?.target || 1,
    reminders: habit.value?.reminders || undefined,
  },
})

const onSubmit = handleSubmit(async (values) => {
  console.log(meta.value)
  console.log(values)
  const error = habit.value ? await updateHabit(habit.value.id, values) : await createHabit(values)
  if (error?.isValidationError()) {
    const errors = mapErrors(error.response.errors)
    for (const [field, err] of Object.entries(errors)) {
      setFieldError(field as any, err.message)
    }
  } else if (error) {
    toast.error('Something went wrong', { description: error.message })
  } else {
    toast.success('Habit ' + (habit.value ? 'updated' : 'created'))
    navigateTo('/app/habits')
  }
})
</script>

<template>
  <Dialog :open="true" @update:open="useRouter().back()">
    <DialogContent>
      <form class="contents" @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>{{ habit ? 'Edit' : 'New' }} Habit</DialogTitle>
          <DialogDescription>
            {{ habit ? `Update details for: ${habit.name}` : 'What are we planning?' }}
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

          <!-- Frequency + Target -->
          <FieldGroup class="flex-row @max-xs:contents">
            <VeeField v-slot="{ field, errors }" name="frequency">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="frequency">Frequency</FieldLabel>
                <Select :model-value="field.value" @update:model-value="field.onChange">
                  <SelectTrigger id="frequency" :aria-invalid="!!errors.length">
                    <SelectValue placeholder="Select a frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Frequency</SelectLabel>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="target">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="target">Target</FieldLabel>
                <Input
                  id="target"
                  v-bind="field"
                  :model-value="field.value"
                  type="number"
                  placeholder="3"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>

          <!-- TODO: Reminders | good daytime picker -->
        </FieldGroup>

        <DialogFooter>
          <Button
            v-if="habit"
            type="button"
            size="icon"
            variant="ghost"
            class="mr-auto max-sm:hidden"
            @click="resetForm"
          >
            <RotateCcw />
          </Button>
          <Button variant="outline" type="button" @click="navigateTo('/app/habits')">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting || !meta.dirty || !meta.valid">
            {{ habit ? 'Save' : 'Create Habit' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
