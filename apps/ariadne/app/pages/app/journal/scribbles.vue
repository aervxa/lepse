<script setup lang="ts">
import { navigateBack } from '~/lib/utils'

const route = useRoute()

const DIALOG_URL = /scribbles\/([^/]+(\/edit)?|create)\/?$/
const SHOW_URL = /scribbles\/[^/|^create]+\/?$/
</script>

<template>
  <Dialog
    v-if="DIALOG_URL.test(route.path)"
    open
    @update:open="
      (v) => {
        v === false && navigateBack()
      }
    "
  >
    <DialogContent :class="[SHOW_URL.test(route.path) && 'sm:max-w-xl']">
      <NuxtPage />
    </DialogContent>
  </Dialog>
</template>
