import { runMain as _runMain } from 'citty'
import { main } from './main'
import type { Options } from './core/types'

export * from './core/types'
export * from './core/runner'

export const runMain = () => _runMain(main)

export function defineConfig(options: Partial<Options>) {
  return options
}
