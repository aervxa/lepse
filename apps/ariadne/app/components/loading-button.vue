<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
import { Button } from './ui/button'

type ButtonProps = InstanceType<typeof Button>['$props']
interface Props extends /* @vue-ignore */ ButtonProps {
  action: () => Promise<unknown>
}
const props = defineProps<Props>()

const isLoading = ref(false)

async function run() {
  isLoading.value = true
  props.action().finally(() => {
    isLoading.value = false
  })
}
</script>

<template>
  <Button :disabled="isLoading" @click="run">
    <slot v-if="isLoading" name="loader">
      <LoaderCircle class="animate-spin" />
    </slot>
    <slot v-else />
  </Button>
</template>
