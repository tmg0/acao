import { defu } from 'defu'
import type { Options } from './types'

export function resolveOptions(rawOptions: Partial<Options>) {
  return defu(rawOptions, {}) as Options
}
