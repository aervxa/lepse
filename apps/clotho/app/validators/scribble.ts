import vine from '@vinejs/vine'

export const createScribbleValidator = vine.create(
  vine.object({
    title: vine.string().minLength(1).maxLength(255).trim().optional().nullable(),
    body: vine.string().trim().optional().nullable(),
  })
)

export const updateScribbleValidator = vine.create(createScribbleValidator.schema.clone().partial())
