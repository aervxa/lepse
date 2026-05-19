import { DateTime } from 'luxon'

export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export type RangeFrequency = 'daily' | 'weekly' | 'monthly'

export function getDateRange(date: string, frequency: RangeFrequency) {
  const dt = DateTime.fromISO(date)
  let start = date
  let end = date

  if (frequency === 'weekly') {
    /**
     * Luxon keeps 1-7 where 1 is Monday and Sunday is 7
     */
    const delta = dt.weekday % 7 // days since current week's sunday
    start = dt.minus({ days: delta }).toISODate()!
    end = dt.plus({ days: 6 - delta }).toISODate()!
  }

  if (frequency === 'monthly') {
    start = dt.startOf('month').toISODate()!
    end = dt.endOf('month').toISODate()!
  }

  return { start, end }
}
