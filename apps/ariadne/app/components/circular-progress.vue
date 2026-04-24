<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    size?: number
    thickness?: number
  }>(),
  {
    size: 32,
    thickness: 4,
  }
)

const mounted = ref(false)
onMounted(() =>
  requestAnimationFrame(() => {
    mounted.value = true
  })
)

const clamped = computed(() => Math.min(100, Math.max(0, props.value)))
const radius = computed(() => (props.size - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(
  () => circumference.value * (1 - (mounted.value ? clamped.value : 0) / 100)
)
const center = computed(() => props.size / 2)
</script>

<template>
  <div
    class="relative inline-flex items-center justify-center flex-shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="progressbar"
    :aria-valuenow="clamped"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" fill="none">
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        stroke="transparent"
        :stroke-width="thickness"
      />
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        stroke="currentColor"
        :stroke-width="thickness"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90)"
        :transform-origin="`${center} ${center}`"
        style="transition: stroke-dashoffset 0.4s ease"
      />
    </svg>
    <div
      class="absolute inset-0 flex items-center justify-center text-[0.75em] font-medium tabular-nums"
    >
      <slot />
    </div>
  </div>
</template>
