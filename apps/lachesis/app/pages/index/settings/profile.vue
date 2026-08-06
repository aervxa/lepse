<script setup lang="ts">
import { Pencil, Trash } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const { user, updateProfile } = useAuth()

const avatar = ref('')
const avatarBlob = ref<Blob | undefined>()
const resetAvatar = () => {
  if (avatar.value) URL.revokeObjectURL(avatar.value)
  avatar.value = user.value?.avatarUrl ?? ''
  avatarBlob.value = undefined
}
const stageAvatar = (blob: Blob) => {
  resetAvatar()
  avatar.value = URL.createObjectURL(blob)
  avatarBlob.value = blob
}
const removeAvatar = () => {
  avatar.value = ''
}

const name = ref('')
const nameEl = useTemplateRef('nameEl')
const resetName = () => {
  if (nameEl.value) nameEl.value.textContent = user.value?.name ?? ''
  name.value = user.value?.name ?? ''
}

const avatarDirty = computed(() => (avatar.value || null) !== user.value?.avatarUrl)
const nameDirty = computed(() => name.value !== user.value?.name)
const dirty = computed(() => avatarDirty.value || nameDirty.value)
const reset = () => {
  resetAvatar()
  resetName()
}
// Set inital values after mount (for waiting for DOM nameEl)
onMounted(() => {
  watch(user, reset, { immediate: true })
})

const saveBtn = useTemplateRef('saveBtn')
const save = async () => {
  const error = await updateProfile({
    name: nameDirty.value ? name.value || null : undefined,
    avatar: avatarDirty.value
      ? avatarBlob.value
        ? (new File([avatarBlob.value], 'avatar', {
            type: avatarBlob.value.type,
          }) as any) /* NOTE: File is accepted, but types expect some Multipart https://github.com/Julien-R44/tuyau/issues/110 */
        : null
      : undefined,
  })
  if (error) {
    toast.error('Something went wrong', { description: error.message })
  } else {
    toast.success('Profile saved!')
  }
}
</script>

<template>
  <EmailVerifiedOnly>
    <DialogClose as-child>
      <Button>Close</Button>
    </DialogClose>
  </EmailVerifiedOnly>

  <!-- Avatar -->
  <div class="flex flex-col gap-2">
    <ImageCropDialog v-slot="{ open }" @crop="stageAvatar">
      <p class="font-mono text-[10px] font-medium tracking-widest uppercase opacity-80">Avatar</p>

      <div class="flex items-center gap-4">
        <Avatar class="size-28">
          <AvatarImage :src="avatar" />
          <AvatarFallback :delay-ms="SKELETON_DELAY_MS">
            {{ user?.initials }}
          </AvatarFallback>
        </Avatar>

        <div class="flex flex-col items-start gap-2">
          <Button variant="outline" size="sm" @click="open">
            <Pencil />
            Edit avatar
          </Button>
          <Button variant="ghost-destructive" size="sm" @click="removeAvatar">
            <Trash />
            Remove avatar
          </Button>
        </div>
      </div>
    </ImageCropDialog>
  </div>

  <!-- Name -->
  <div class="flex flex-col gap-2">
    <p class="font-mono text-[10px] font-medium tracking-widest uppercase opacity-80">Name</p>
    <p
      ref="nameEl"
      data-placeholder="required"
      class="before:text-destructive/50 text-xl font-medium outline-none before:pointer-events-none before:text-xl before:font-light before:italic empty:before:content-[attr(data-placeholder)]"
      @input="name = nameEl?.textContent ?? ''"
      contenteditable
    ></p>
  </div>

  <DialogFooter
    v-if="dirty"
    class="border-border/60 mt-auto items-center border-t pt-4 sm:justify-between"
  >
    <p class="text-muted-foreground mr-auto text-sm">you have unsaved changes!</p>
    <div class="flex items-center gap-2">
      <Button variant="outline" :disabled="saveBtn?.isLoading" @click="reset">reset</Button>
      <LoadingButton ref="saveBtn" :action="save">save</LoadingButton>
    </div>
  </DialogFooter>
</template>
