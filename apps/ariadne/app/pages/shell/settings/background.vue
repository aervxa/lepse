<script setup lang="ts">
const { backgrounds, selectBackground } = useBackgrounds()

const groupedBackgrounds = computed(() =>
  Object.entries(
    backgrounds.value.reduce<Record<string, typeof backgrounds.value>>((acc, bg) => {
      ;(acc[bg.style] ??= []).push(bg)
      return acc
    }, {})
  ).sort(([style1], [style2]) => style1.localeCompare(style2))
)

const isSelecting = ref(false)
const select = (id: number) => {
  skeletonLoad(selectBackground({ id }), isSelecting)
}
</script>

<template>
  <DialogTitle>Backgrounds</DialogTitle>
  <ScrollArea class="-m-6 max-h-116">
    <div class="grid grid-cols-1 gap-2 overflow-y-auto p-4 pb-6 sm:grid-cols-2">
      <template v-for="([style, backgrounds], index) in groupedBackgrounds" :key="index">
        <p
          class="col-span-full mt-2 px-2 font-mono text-[10px] font-medium tracking-widest uppercase opacity-80"
        >
          {{ style }}
        </p>
        <Button
          v-for="background in backgrounds"
          :key="background.id"
          variant="ghost"
          class="flex h-auto flex-col gap-2 rounded-2xl p-2"
          :disabled="isSelecting"
          @click="select(background.id)"
        >
          <img
            :src="background.url"
            class="border-border pointer-events-none rounded-[inherit] border"
          />
          <p class="text-center capitalize">{{ background.name.replace('-', ' ') }}</p>
        </Button>
      </template>
    </div>
  </ScrollArea>
</template>
