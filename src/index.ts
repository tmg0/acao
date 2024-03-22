import { execaCommand } from 'execa'
import { runMain as _runMain } from 'citty'
import { main } from './main'
import type { Acao, Options } from './types'

export * from './types'

export type DefineConfigOptions = (options: Options) => Partial<Acao>

export const runMain = () => _runMain(main)

export function run(cmd: string) {
  return () => execaCommand(cmd, { stdio: 'inherit' })
}

export function defineConfig(options: DefineConfigOptions) {
  return options
}
