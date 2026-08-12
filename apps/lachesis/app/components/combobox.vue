<script setup lang="ts" generic="T extends { id: number; name: string }">
import { Plus } from '@lucide/vue'
import type { PopoverContentProps } from 'reka-ui'

const props = withDefaults(
  defineProps<{
    items?: T[]
    checkedItemId?: T['id']
    empty?: string
    placeholder?: string
    align?: PopoverContentProps['align']
    create?: (search: string) => Promise<unknown>
  }>(),
  { align: 'start' }
)
const emit = defineEmits<{
  (e: 'select', item: T): void
}>()
const open = defineModel<boolean>('open')

const slots = useSlots()
if (!slots.default) {
  console.warn('Combobox requires a default slot for the trigger')
}

const search = ref('')
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <slot />
    </PopoverTrigger>
    <PopoverContent :align class="p-0" v-bind="$attrs">
      <Command highlight-on-hover class="rounded-[inherit] bg-transparent backdrop-blur-none">
        <CommandInput :placeholder="props.placeholder" v-model="search" />
        <CommandList>
          <CommandEmpty :class="{ 'flex flex-col items-center gap-2': props.create }">
            {{ props.empty }}
            <LoadingButton
              v-if="props.create && search"
              variant="outline"
              size="xs"
              :action="
                async () => {
                  if (!props.create) throw new Error('create is not defined') // create should never be undefined once set
                  await props.create(search)
                  open = false
                  const item = props.items?.find((item) => item.name === search)
                  if (!item) throw new Error('item not found, but should') // if props.create succeeds, item should always be found
                  emit('select', item)
                }
              "
            >
              <Plus />
              create
            </LoadingButton>
          </CommandEmpty>
          <CommandGroup v-if="props.items?.length">
            <CommandItem
              v-for="item in props.items"
              :key="item.id"
              :value="item.id"
              :data-checked="item.id === props.checkedItemId"
              @select="((open = false), emit('select', item))"
              class="data-highlighted:bg-muted/60 data-highlighted:ring-ring/20 data-highlighted:ring"
            >
              {{ item.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
