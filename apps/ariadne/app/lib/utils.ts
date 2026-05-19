import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapErrors<T extends { field: string }>(errors: T[]) {
  return Object.fromEntries(errors.map((e) => [e.field, e]))
}

export function getClientDate(date?: Date | string | null) {
  const d =
    typeof date === 'string'
      ? new Date(date.includes('T') ? date : date + 'T00:00')
      : (date ?? new Date())
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function navigateBack() {
  navigateTo(
    '/' +
      useRoute()
        .path.split('/')
        .filter(Boolean) // removes empty strings from the arr due to trailing slashes
        .slice(0, -1) // remove the last segment (to go back)
        .join('/')
  )
}
