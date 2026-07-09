<script setup lang="ts">
import { Pencil, Trash, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const { user, updateAvatar } = useAuth()
// const nameEl = useTemplateRef('nameEl')
// const profileName = ref('')
// const pendingAvatar = shallowRef<Blob | null>(null)
// const pendingAvatarUrl = ref<string | null>(null)
// const avatarRemoved = ref(false)
// const isSaving = ref(false)

// const avatarSrc = computed(() => {
//   if (avatarRemoved.value) return ''
//   return pendingAvatarUrl.value ?? user.value?.avatarUrl ?? ''
// })

// const hasNameChanges = computed(() => profileName.value !== (user.value?.fullName ?? ''))
// const hasAvatarChanges = computed(() => !!pendingAvatar.value || avatarRemoved.value)
// const hasUnsavedChanges = computed(() => hasNameChanges.value || hasAvatarChanges.value)

// const syncName = () => {
//   profileName.value = user.value?.fullName ?? ''
//   if (nameEl.value) nameEl.value.textContent = profileName.value
// }

// watch(
//   user,
//   () => {
//     if (!hasUnsavedChanges.value) syncName()
//   },
//   { immediate: true, flush: 'post' }
// )

// const initials = (fullName: string | null | undefined, email: string | undefined) => {
//   const [first, last] = fullName ? fullName.split(' ') : (email ?? '').split('@')
//   if (first && last) return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
//   return `${first?.slice(0, 2)}`.toUpperCase()
// }

// const clearEmptyInput = (event: InputEvent) => {
//   const target = event.currentTarget as HTMLElement
//   if (!target) return
//   if (!target.textContent) target.textContent = null
//   profileName.value = target.textContent ?? ''
// }

// const stageAvatar = (blob: Blob) => {
//   if (pendingAvatarUrl.value) URL.revokeObjectURL(pendingAvatarUrl.value)
//   pendingAvatar.value = blob
//   pendingAvatarUrl.value = URL.createObjectURL(blob)
//   avatarRemoved.value = false
// }

// const removeAvatar = () => {
//   pendingAvatar.value = null
//   if (pendingAvatarUrl.value) URL.revokeObjectURL(pendingAvatarUrl.value)
//   pendingAvatarUrl.value = null
//   avatarRemoved.value = true
// }

// const reset = () => {
//   syncName()
//   pendingAvatar.value = null
//   if (pendingAvatarUrl.value) URL.revokeObjectURL(pendingAvatarUrl.value)
//   pendingAvatarUrl.value = null
//   avatarRemoved.value = false
// }

// const saveAvatar = async (blob: Blob) => {
//   const file = new File([blob], 'avatar', { type: blob.type })
//   return updateAvatar({
//     avatar:
//       file as any /* NOTE: File is accepted, but types expect some Multipart https://github.com/Julien-R44/tuyau/issues/110 */,
//   })
// }

// const save = async () => {
//   if (!user.value || !hasUnsavedChanges.value) return

//   isSaving.value = true
//   const currentUser = user.value

//   if (hasNameChanges.value) {
//     user.value = {
//       ...currentUser,
//       fullName: profileName.value || null,
//       initials: initials(profileName.value, currentUser.email),
//     }
//   }

//   if (pendingAvatar.value) {
//     const error = await saveAvatar(pendingAvatar.value)
//     if (error) {
//       toast.error('Something went wrong', { description: error.message })
//       isSaving.value = false
//       return
//     }
//   }

//   if (avatarRemoved.value) {
//     user.value = { ...user.value, avatarUrl: null }
//   }

//   pendingAvatar.value = null
//   if (pendingAvatarUrl.value) URL.revokeObjectURL(pendingAvatarUrl.value)
//   pendingAvatarUrl.value = null
//   avatarRemoved.value = false
//   isSaving.value = false
//   toast.success('Profile updated!')
// }

// onBeforeUnmount(() => {
//   if (pendingAvatarUrl.value) URL.revokeObjectURL(pendingAvatarUrl.value)
// })

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

const dirty = computed(() => avatar.value !== user.value?.avatarUrl)
const reset = () => {
  resetAvatar()
}
watch(user, reset, { immediate: true })

const saveBtn = useTemplateRef('saveBtn')
const save = async () => {
  console.log('saving', avatarBlob.value)
  // TODO: supprt removing
  if (avatarBlob.value) {
    const file = new File([avatarBlob.value], 'avatar', { type: avatarBlob.value.type })
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
}
</script>

<template>
  <DialogTitle>Edit profile</DialogTitle>

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
  <!-- <div class="flex flex-col gap-2">
    <p class="font-mono text-[10px] font-medium tracking-widest uppercase opacity-80">Name</p>
    <p
      ref="nameEl"
      data-placeholder="No name provided."
      class="before:text-muted-foreground text-2xl font-medium outline-none before:pointer-events-none before:text-xl before:font-light before:italic empty:before:content-[attr(data-placeholder)]"
      @input="clearEmptyInput"
      contenteditable
    ></p>
  </div> -->

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
