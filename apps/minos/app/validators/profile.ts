import vine from '@vinejs/vine'

export const updateValidator = vine.create({
  name: vine.string().nullable().optional(),
  avatar: vine
    .file({
      size: '100kb',
      extnames: ['webp'],
    })
    .nullable()
    .optional(),
})
