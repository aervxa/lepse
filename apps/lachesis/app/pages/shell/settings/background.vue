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

  <DialogTitle>Backgrounds</DialogTitle>

  <div class="relative -m-6 flex-1">
    <div class="absolute inset-0">
      <ScrollArea class="size-full">
        <div class="2xs:grid-cols-2 grid grid-cols-1 gap-2 overflow-y-auto p-4">
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
              :class="[background.id === activeBackgroundId && 'bg-muted!']"
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
      </ScrollArea>
    </div>
  </div>
</template>
