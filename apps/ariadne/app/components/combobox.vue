<script setup lang="ts" generic="T extends { id: number; name: string }">
import type { PopoverContentProps } from 'reka-ui'

const props = withDefaults(
  defineProps<{
    items?: T[]
    checkedItemId?: T['id']
    empty?: string
    placeholder?: string
    align?: PopoverContentProps['align']
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
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <slot />
    </PopoverTrigger>
    <PopoverContent :align class="p-0">
      <Command highlight-on-hover>
        <CommandInput :placeholder="props.placeholder" />
        <CommandList>
          <CommandEmpty>{{ props.empty }}</CommandEmpty>
          <CommandGroup v-if="props.items?.length">
            <CommandItem
              v-for="item in props.items"
              :key="item.id"
              :value="item.id"
              :data-checked="item.id === props.checkedItemId"
              @select="((open = false), emit('select', item))"
            >
              {{ item.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
