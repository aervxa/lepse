<!-- TODO: Save -->
<script setup lang="ts">
import { clamp } from '@vueuse/core'
import { ImageIcon, RotateCcw } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const SIZE = 224
const OUTPUT_SIZE = 128

const props = defineProps<{
  onCrop?: (blob: Blob) => void | Promise<void>
}>()

const uploadInput = useTemplateRef('uploadInput')
const open = computed({
  get: () => !!img.value.src,
  set: (value: boolean) => {
    if (!value) {
      img.value.src = ''
      reset()
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
      reset()
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
  if (!slider.value[0] || !img.value.src) return

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

const reset = () => {
  slider.value[0] = 0
  x.set(constraints.value.x / 2)
  y.set(constraints.value.y / 2)
}

const crop = () => {
  return new Promise<void>((resolve) => {
    const tmpImg = new Image()
    tmpImg.src = img.value.src
    tmpImg.onload = async function () {
      const canvas = new OffscreenCanvas(OUTPUT_SIZE, OUTPUT_SIZE)
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        toast.error('Something went wrong', { description: 'browser quirks, please try again!' })
        return
      }
      ctx.drawImage(
        tmpImg,
        -x.get() / scale.value,
        -y.get() / scale.value,
        SIZE / scale.value,
        SIZE / scale.value,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE
      )
      const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.8 })
      await props.onCrop?.(blob)
      open.value = false
      resolve()
    }
  })
}
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

      <DialogFooter>
        <Button variant="ghost" size="icon" class="mr-auto" @click="reset">
          <RotateCcw />
        </Button>
        <Button variant="outline">Cancel</Button>
        <LoadingButton :action="crop">Save</LoadingButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
