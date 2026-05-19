import vine from '@vinejs/vine'
import { DATE_REGEX } from '../lib/util/date.ts'

const date = vine.string().regex(DATE_REGEX)

export const dateRangeValidator = vine.create(
  vine.object({
    date,
    frequency: vine.enum(['daily', 'weekly', 'monthly']),
  })
)
