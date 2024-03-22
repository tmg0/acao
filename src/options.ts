import type { Options } from './types'

export function resolveOptions(rawOptions: Partial<Options>) {
  return rawOptions as Options
}
