<script setup lang="ts">
import { toast } from 'vue-sonner'

const { updateAvatar } = useAuth()

const saveAvatar = async (blob: Blob) => {
  const file = new File([blob], 'avatar', { type: blob.type })
  const error = await updateAvatar({
    avatar:
      file as any /* NOTE: File is accepted, but types expect some Multipart https://github.com/Julien-R44/tuyau/issues/110 */,
  })
  if (error) {
    toast.error('Something went wrong', { description: error.message })
  } else {
    toast.success('Avatar updated!')
  }
}
</script>

<template>
  <ImageCropDialog v-slot="{ open }" @crop="saveAvatar">
    <Button @click="open">Upload</Button>
  </ImageCropDialog>
</template>
