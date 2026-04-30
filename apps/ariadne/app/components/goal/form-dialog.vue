<script setup lang="ts">
import { useForm, Field as VeeField } from 'vee-validate'
import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { mapErrors } from '~/lib/utils'
import { toast } from 'vue-sonner'
import { RotateCcw } from 'lucide-vue-next'

const props = defineProps<{
  goalId?: number
}>()

const { goals, createGoal, updateGoal } = useGoals()

const goal = computed(() => goals.value.find((g) => g.id === props.goalId))

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(2500).optional(),
})

const { handleSubmit, setFieldError, isSubmitting, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    name: goal.value?.name,
    description: goal.value?.description || undefined,
  },
})

const onSubmit = handleSubmit(async (values) => {
  const error = goal.value ? await updateGoal(goal.value.id, values) : await createGoal(values)
  if (error?.isValidationError()) {
    const errors = mapErrors(error.response.errors)
    for (const [field, err] of Object.entries(errors)) {
      setFieldError(field as any, err.message)
    }
  } else if (error) {
    toast.error('Something went wrong', { description: error.message })
  } else {
    toast.success('Goal ' + (goal.value ? 'updated' : 'created'))
    navigateTo('/app/goals')
  }
})
</script>

<template>
  <Dialog :open="true" @update:open="useRouter().back()">
    <DialogContent>
      <form class="contents" @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>{{ goal ? 'Edit' : 'New' }} Goal</DialogTitle>
          <DialogDescription>
            {{ goal ? `Update details for: ${goal.name}` : 'What are we adding now?' }}
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
                placeholder="e.g. Get xyz"
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
        </FieldGroup>

        <DialogFooter>
          <Button
            v-if="goal"
            type="button"
            size="icon"
            variant="ghost"
            class="mr-auto max-sm:hidden"
            @click="resetForm"
          >
            <RotateCcw />
          </Button>
          <Button variant="outline" type="button" @click="navigateTo('/app/goals')">
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitting || !meta.dirty || !meta.valid">
            {{ goal ? 'Save' : 'Create Goal' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
