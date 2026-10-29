import vine from '@vinejs/vine'

export const searchLoungeValidator = vine.create(
  vine.object({
    id: vine.string().uuid(),
  })
)
