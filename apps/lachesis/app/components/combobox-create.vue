<script setup lang="ts" generic="T extends { id: number; name: string }">
import { CheckIcon, LoaderCircle, Plus } from '@lucide/vue'
import { useFilter, type ComboboxContentProps } from 'reka-ui'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    items?: T[]
    checkedItemId?: T['id']
    empty?: string
    placeholder?: string
    align?: ComboboxContentProps['align']
    create?: (search: string) => Promise<unknown>
    preventSelect?: boolean
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
const { startsWith } = useFilter({ sensitivity: 'base' })
const filteredItems = computed(() => props.items?.filter((p) => startsWith(p.name, search.value)))

const isCreating = ref(false)
const create = async () => {
  try {
    isCreating.value = true
    if (!props.create) throw new Error('create is not defined') // create should never be undefined once set
    await props.create(search.value)
    open.value = false
    const item = props.items?.find((item) => item.name === search.value)
    if (!item) throw new Error('item not found, but should') // if props.create succeeds, item should always be found
    emit('select', item)
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <Combobox v-model:open="open" ignore-filter>
    <ComboboxAnchor as-child>
      <ComboboxTrigger as-child>
        <slot />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList :align v-bind="$attrs">
      <ComboboxInput v-model="search" :display-value="() => ''" :placeholder="props.placeholder" />
      <ComboboxViewport>
        <ComboboxEmpty>
          {{ props.empty }}
        </ComboboxEmpty>
        <ComboboxGroup>
          <ComboboxItem
            v-if="
              search &&
              !filteredItems?.find(
                (item) => item.name.toLocaleLowerCase() === search.toLocaleLowerCase()
              )
            "
            value="create"
            @select.prevent="create"
            as-child
          >
            <Button
              variant="outline"
              size="sm"
              class="data-highlighted:bg-primary/20 not-last:mb-1"
            >
              <LoaderCircle v-if="isCreating" class="animate-spin" />
              <Plus v-else />
              Create
              <span class="truncate">"{{ search }}"</span>
            </Button>
          </ComboboxItem>

          <ComboboxItem
            v-for="item in filteredItems"
            :key="item.id"
            :value="item.id"
            @select="
              (preventSelect && $event.preventDefault(), (open = false), emit('select', item))
            "
          >
            {{ item.name }}
            <ComboboxItemIndicator>
              <CheckIcon />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxList>
  </Combobox>
</template>
