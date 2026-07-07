<!-- TODO: Save -->
<script setup lang="ts">
import { clamp } from '@vueuse/core'
import { ImageIcon } from 'lucide-vue-next'

const uploadInput = useTemplateRef('uploadInput')
const open = computed({
  get: () => !!img.value.src,
  set: (value: boolean) => {
    if (!value) {
      // reset
      img.value.src = ''
      slider.value[0] = 0
      x.set(0)
      y.set(0)
    }
    return value
  },
})
const slider = ref<[number]>([0])

const img = ref<{
  src: string
  width: number
  height: number
}>({ src: '', width: 0, height: 0 })
const SIZE = 224
const baseScale = ref(0)

const openPicker = () => {
  uploadInput.value?.click()
}
const upload = (e: Event) => {
  const target = e.currentTarget as HTMLInputElement
  if (!target.files?.[0]) return
  const reader = new FileReader()
  reader.readAsDataURL(target.files[0])
  reader.onload = (reader) => {
    img.value.src = reader.target?.result?.toString() ?? ''
    const tmpImg = new Image()
    tmpImg.src = img.value.src
    tmpImg.onload = function () {
      img.value.width = tmpImg.width
      img.value.height = tmpImg.height
      // initial drag pos would be based on whichever side is longer, so baseScale is measured from the other "base" side
      baseScale.value = SIZE / Math.min(img.value.width, img.value.height)
      // initial center image
      x.set(constraints.value.x / 2)
      y.set(constraints.value.y / 2)
    }
  }
}

const scale = computed(() => baseScale.value * (1 + slider.value[0] / 100))
const x = useMotionValue(0)
const y = useMotionValue(0)
const constraints = computed(() => ({
  x: SIZE - img.value.width * scale.value,
  y: SIZE - img.value.height * scale.value,
}))
watch(scale, (newScale, oldScale) => {
  if (!oldScale || !img.value.src) return

  /**
   * explanation:
   * L is length from left of image to center (not of iamge, but of the overlay selection)
   * L = x-offset + R   | initial tainted length
   * L * ratio          | apply adjusted scale (remove old and apply new)
   * L - R              | get offset
   *
   * Below is the same idea, but x is in negative due to drag direction
   */

  const R = SIZE / 2
  const ratio = newScale / oldScale
  x.set(clamp(R - (R - x.get()) * ratio, constraints.value.x, 0))
  y.set(clamp(R - (R - y.get()) * ratio, constraints.value.y, 0))
})
</script>

<template>
  <Dialog v-model:open="open">
    <input
      ref="uploadInput"
      type="file"
      accept="image/*"
      class="sr-only"
      aria-label="Upload image"
      @change="upload"
    />
    <slot :open="openPicker" />

    <DialogContent class="aspect-4/5. sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>Edit Image</DialogTitle>
        <DialogDescription class="sr-only">Crop nd Scale</DialogDescription>
      </DialogHeader>

      <div class="bg-muted relative flex h-64 flex-col overflow-hidden rounded-2xl">
        <div
          dir="ltr"
          :style="{ width: SIZE + 'px' }"
          class="absolute inset-0 m-auto aspect-square"
        >
          <Motion
            as="img"
            :src="img.src"
            :style="{
              width: img.width * scale,
              height: img.height * scale,
              x,
              y,
            }"
            class="absolute max-w-none cursor-grab active:cursor-grabbing"
            drag
            draggable="false"
            :drag-elastic="0.001"
            :drag-momentum="false"
            :drag-constraints="{
              left: constraints.x,
              top: constraints.y,
              right: 0,
              bottom: 0,
            }"
          />
          <div
            class="pointer-events-none absolute inset-0 rounded-full border-4 border-white shadow-[0_0_0_9999px] shadow-black/50"
          ></div>
        </div>
      </div>

      <div class="flex items-center justify-center gap-2">
        <ImageIcon class="size-4" />
        <Slider v-model="slider" class="w-1/3" />
        <ImageIcon class="size-6" />
      </div>
    </DialogContent>
  </Dialog>
</template>
