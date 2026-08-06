<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { ChevronRight, Plus, X } from 'lucide-vue-next'
import { PopoverClose } from 'reka-ui'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import z from 'zod'

const source = inject(bubbleNavSourceKey)

const route = useRoute()
const { user } = useAuth()
const { goals, createGoal } = useGoals()

const inSubpage = computed(() => /goals\/\d+/.test(route.path))

const [subpage, animateSubpage] = useAnimate()
const openSubpage = () => {
  animateSubpage(
    subpage.value,
    {
      opacity: [0, 1],
      x: ['2rem', 0],
      filter: ['blur(4px)', 'blur(0px)'],
    },
    contentTransition.in()
  )
}

const createOpen = ref(false)
const schema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(2500).optional(),
})

const { handleSubmit, setFieldError, isSubmitting, meta } = useForm({
  validationSchema: toTypedSchema(schema),
})

const onSubmit = handleSubmit(async (values) => {
  const error = await createGoal(values)
  if (error?.isValidationError()) {
    const errors = mapErrors(error.response.errors)
    for (const [field, err] of Object.entries(errors)) {
      setFieldError(field as any, err.message)
    }
  } else if (error) {
    toast.error('Something went wrong!', { description: error.message })
  } else {
    toast.success('Goal created!')
    createOpen.value = false
  }
})
</script>
<template>
  <Gatekeep
    v-if="user"
    :check="user?.emailVerified"
    title="Please verify your email to create goals."
  />
  <Gatekeep
    v-else
    :check="false"
    title="You must be logged in to create goals."
    action-label="Login"
    :action="() => navigateTo('/login')"
  />

  <div class="flex size-full flex-1 flex-col" :class="[source === 'drawer' && 'mx-auto max-w-sm']">
    <AnimatePresence mode="popLayout">
      <Motion
        v-show="!inSubpage"
        as="div"
        class="flex flex-1 flex-col"
        :initial="{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }"
        :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: contentTransition.in() }"
        :exit="{
          opacity: 0,
          scale: 0.95,
          filter: 'blur(4px)',
          transition: contentTransition.out(),
        }"
      >
        <!-- Close button -->
        <PopoverClose v-if="source === 'popover'" as-child>
          <Button variant="ghost" size="icon" class="absolute top-1.5 right-1.5">
            <X />
          </Button>
        </PopoverClose>

        <!-- Heading -->
        <DrawerHeader v-if="source === 'drawer'">
          <DrawerTitle class="text-2xl">Goals</DrawerTitle>
          <DrawerDescription>Manage what matters.</DrawerDescription>
        </DrawerHeader>
        <PopoverHeader v-if="source === 'popover'" class="p-4 pb-2">
          <PopoverTitle class="text-2xl">Goals</PopoverTitle>
          <PopoverDescription>Manage what matters.</PopoverDescription>
        </PopoverHeader>

        <Empty v-if="goals.length === 0" class="mb-12">
          <EmptyHeader>
            <EmptyTitle>No goals yet.</EmptyTitle>
            <EmptyDescription>You have yet to create any goals.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button @click="createOpen = true">Create Goal</Button>
          </EmptyContent>
        </Empty>
        <!-- List | relative/absolute wrapper to force contenteditable p tag into a fixed space (otherwise grows parent) -->
        <div v-else class="relative flex-1">
          <div class="absolute inset-0">
            <ScrollArea class="size-full">
              <div class="flex flex-col gap-3 p-4">
                <Item v-for="goal in goals" :key="goal.id" variant="outline" as-child>
                  <NuxtLink :to="`/goals/${goal.id}`" @click="openSubpage">
                    <ItemContent>
                      <ItemTitle>{{ goal.name }}</ItemTitle>
                      <ItemDescription :class="[!goal.description && 'italic']">
                        {{ goal.description ?? 'No description provided' }}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <ChevronRight class="size-4" />
                    </ItemActions>
                  </NuxtLink>
                </Item>
              </div>
            </ScrollArea>
          </div>
        </div>

        <!-- Create -->
        <Dialog v-model:open="createOpen">
          <DialogTrigger v-if="goals.length > 0" as-child>
            <Button size="icon-lg" class="absolute right-4 bottom-4">
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form class="contents" @submit="onSubmit">
              <DialogHeader>
                <DialogTitle>New Goal</DialogTitle>
                <DialogDescription>Don't add too many at once</DialogDescription>
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
                <DialogClose>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <LoadingButton
                  type="submit"
                  :disabled="isSubmitting || !meta.valid"
                  :loading="isSubmitting"
                >
                  Create Goal
                </LoadingButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Motion>

      <!-- item page -->
      <Motion
        v-show="inSubpage"
        as="div"
        ref="subpage"
        class="flex flex-1 flex-col"
        :initial="{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }"
        :animate="{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: contentTransition.in() }"
      >
        <NuxtPage />
      </Motion>
    </AnimatePresence>
  </div>
</template>
