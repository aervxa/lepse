<script setup lang="ts">
interface Props extends /* @vue-ignore */ Partial<HTMLImageElement> {}
const props = defineProps<Props>()

const hasLoaded = ref(false)
// reset hasLoaded if src changes
watch(
  () => props.src,
  () => {
    hasLoaded.value = false
  }
)
</script>

<template>
  <img v-show="hasLoaded" @load="hasLoaded = true" />
</template>
