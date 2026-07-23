<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
import { Button } from './ui/button'

type ButtonProps = InstanceType<typeof Button>['$props']
interface Props extends /* @vue-ignore */ ButtonProps {
  action?: () => Promise<unknown>
  loading?: boolean
  forceSlot?: boolean
}
const props = defineProps<Props>()
if (props.action && props.loading) {
  throw new Error('loading-button: you should pass either `action` or `loading`, not both')
}
if (props.action === undefined && props.loading === undefined) {
  throw new Error('loading-button: you have to pass one of either `action` or `loading`')
}

const isLoading = ref(false)

async function run() {
  props.action && skeletonLoad(props.action(), isLoading)
}

let timeout: NodeJS.Timeout
watch(
  () => props.loading,
  () => {
    if (props.loading) {
      timeout = setTimeout(() => {
        isLoading.value = true
      }, SKELETON_DELAY_MS)
    } else {
      clearTimeout(timeout)
      isLoading.value = false
    }
  },
  { immediate: true }
)

defineExpose({
  isLoading: readonly(isLoading),
})
</script>

<template>
  <Button :disabled="isLoading" @click="run">
    <slot v-if="isLoading" name="loader">
      <LoaderCircle class="animate-spin" />
      <slot v-if="props.forceSlot" />
    </slot>
    <slot v-else />
  </Button>
</template>
