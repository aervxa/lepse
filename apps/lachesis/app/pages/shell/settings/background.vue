<script setup lang="ts">
import { toast } from 'vue-sonner'

const { backgrounds, activeBackgroundId, selectBackground } = useBackgrounds()

const groupedBackgrounds = computed(() =>
  Object.entries(
    backgrounds.value.reduce<Record<string, typeof backgrounds.value>>((acc, bg) => {
      ;(acc[bg.style] ??= []).push(bg)
      return acc
    }, {})
  ).sort(([style1], [style2]) => style1.localeCompare(style2))
)

const select = async (id: number) => {
  const error = await selectBackground({ id })
  if (error) {
    toast.error('Failed to update background!', { description: error.message })
  }
}
</script>

<template>
  <EmailVerifiedOnly>
    <DialogClose as-child>
      <Button>Close</Button>
    </DialogClose>
  </EmailVerifiedOnly>

  <div class="2xs:grid-cols-2 grid grid-cols-1 gap-2">
    <template v-for="([style, backgrounds], index) in groupedBackgrounds" :key="index">
      <p
        class="col-span-full font-mono text-[10px] font-medium tracking-widest uppercase opacity-80 not-first:mt-2"
      >
        {{ style }}
      </p>
      <Button
        v-for="background in backgrounds"
        :key="background.id"
        variant="ghost"
        class="flex h-auto flex-col gap-2 rounded-2xl p-2"
        :class="[background.id === activeBackgroundId && 'bg-muted!']"
        :disabled="background.id === activeBackgroundId"
        @click="select(background.id)"
      >
        <img
          :src="background.url"
          class="border-border bg-muted/60 pointer-events-none aspect-video w-full rounded-[inherit] border"
        />
        <p class="text-center capitalize">{{ background.name.replace('-', ' ') }}</p>
      </Button>
    </template>
  </div>
</template>
