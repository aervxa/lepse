import vine from '@vinejs/vine'

export const updateJournalValidator = vine.create(
  vine
    .object({
      body: vine.string().optional().nullable(),
      mood: vine.number().range([1, 5]).optional().nullable(),
    })
    .partial()
)
