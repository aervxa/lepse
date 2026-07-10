import vine from '@vinejs/vine'

export const selectBackgroundValidator = vine.create(
  vine.object({
    id: vine.number().exists({ table: 'backgrounds', column: 'id' }),
  })
)
