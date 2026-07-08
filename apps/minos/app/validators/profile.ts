import vine from '@vinejs/vine'

export const updateAvatarValidator = vine.create({
  avatar: vine.file({
    size: '100kb',
    extnames: ['webp'],
  }),
})
