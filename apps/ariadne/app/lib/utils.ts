import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapErrors<T extends { field: string }>(errors: T[]) {
  return Object.fromEntries(errors.map((e) => [e.field, e]))
}
