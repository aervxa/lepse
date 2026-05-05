import vine from '@vinejs/vine'

export const updateJournalValidator = vine.create(
  vine
    .object({
      body: vine.string().optional(),
      mood: vine.number().range([1, 5]).optional(),
    })
    .partial()
)
