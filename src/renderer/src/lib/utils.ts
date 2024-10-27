import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import _ from 'lodash'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function convertSnakeToCamel<T extends Record<string, unknown>>(data: T[]): T[] {
  return data.map((item) => {
    return _.mapKeys(item, (_value, key) => _.camelCase(key))
  }) as T[]
}
