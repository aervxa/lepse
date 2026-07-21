<script setup lang="ts">
import { useForm, Field as VeeField } from 'vee-validate'
import z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import { RotateCcw } from 'lucide-vue-next'

const props = defineProps<{
  scribbleId?: number
}>()

const { scribbles, createScribble, updateScribble } = useScribbles()

const scribble = computed(() => scribbles.value.find((entry) => entry.id === props.scribbleId))

const schema = z.object({
  title: z.string().min(1).max(255).optional(),
  body: z.string().optional(),
})

const { handleSubmit, setFieldError, isSubmitting, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    title: scribble.value?.title || undefined,
    body: scribble.value?.body || undefined,
  },
})

const onSubmit = handleSubmit(async (values) => {
  const error = scribble.value
    ? await updateScribble(scribble.value.id, values)
    : await createScribble(values)

  if (error?.isValidationError()) {
    const errors = mapErrors(error.response.errors)
    for (const [field, err] of Object.entries(errors)) {
      setFieldError(field as any, err.message)
    }
  } else if (error) {
    toast.error('Something went wrong', { description: error.message })
  } else {
    toast.success('Scribble ' + (scribble.value ? 'updated' : 'created'))
    navigateBack()
  }
})
</script>

<template>
  <form class="contents" @submit="onSubmit">
    <DialogHeader>
      <DialogTitle>{{ scribble ? 'Edit' : 'New' }} Scribble</DialogTitle>
      <DialogDescription>
        {{
          scribble
            ? `Update details for: ${scribble.title}`
            : 'Capture a note or even just a passing thought.'
        }}
      </DialogDescription>
    </DialogHeader>

    <FieldGroup>
      <!-- Title -->
      <VeeField v-slot="{ field, errors }" name="title">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="title">Title</FieldLabel>
          <Input
            id="title"
            v-bind="field"
            :model-value="field.value"
            placeholder="Untitled thought"
            :aria-invalid="!!errors.length"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>

      <!-- Body / Content -->
      <VeeField v-slot="{ field, errors }" name="body">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="body">Content</FieldLabel>
          <Textarea
            id="body"
            v-bind="field"
            :model-value="field.value"
            rows="10"
            class="min-h-48 resize-none"
            placeholder="Capture the thought before it disappears..."
            :aria-invalid="!!errors.length"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>
    </FieldGroup>

    <DialogFooter>
      <Button
        v-if="scribble"
        type="button"
        size="icon"
        variant="ghost"
        class="mr-auto max-sm:hidden"
        @click="resetForm"
      >
        <RotateCcw />
      </Button>
      <Button variant="outline" type="button" @click="navigateBack()"> Cancel </Button>
      <Button type="submit" :disabled="isSubmitting || !meta.dirty || !meta.valid">
        {{ scribble ? 'Save' : 'Create Scribble' }}
      </Button>
    </DialogFooter>
  </form>
</template>
