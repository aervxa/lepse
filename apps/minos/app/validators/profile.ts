import vine from '@vinejs/vine'

export const updateValidator = vine.create({
  name: vine.string().nullable().optional(),
  avatar: vine
    .file({
      size: '500kb',
      extnames: ['png'],
    })
    .nullable()
    .optional(),
})
