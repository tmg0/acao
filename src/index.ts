import type { Options } from './core/types'
import { runMain as _runMain } from 'citty'
import { main } from './main'

export * from './core/runner'
export * from './core/types'

export const runMain = () => _runMain(main)

export function defineConfig(options: Partial<Options>) {
  return options
}
