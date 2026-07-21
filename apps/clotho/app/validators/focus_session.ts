import vine from '@vinejs/vine'

export const focusSessionValidator = vine.create({
  pomoCount: vine.number().positive().optional(),
  stopwatchMs: vine.number().positive().optional(),
})
