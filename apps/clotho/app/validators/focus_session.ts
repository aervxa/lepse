import vine from '@vinejs/vine'

export const focusSessionValidator = vine.create({
  pomoCount: vine.number().positive().withoutDecimals().optional(),
  stopwatchMs: vine.number().positive().withoutDecimals().optional(),
})
