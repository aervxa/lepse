<script
  setup
  lang="ts"
  generic="T extends { title: string; description: string; disabled?: boolean }"
>
const props = defineProps<{ groups: Record<string, readonly T[] | T[]> }>()
</script>

<template>
  <div v-for="[group, settings] in Object.entries(groups)" class="flex flex-col">
    <p class="mb-2 font-mono text-[10px] font-medium tracking-widest uppercase opacity-80">
      {{ group }}
    </p>
    <template v-for="setting in settings" :key="setting.title">
      <Item v-if="setting.disabled !== true" size="xs" class="px-0">
        <ItemContent>
          <ItemTitle>{{ setting.title }}</ItemTitle>
          <ItemDescription v-if="setting.description" class="text-xs">
            {{ setting.description }}
          </ItemDescription>
        </ItemContent>
        <ItemActions class="self-start">
          <slot :setting="setting" />
        </ItemActions>
      </Item>
    </template>
  </div>
</template>
