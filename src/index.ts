import type { Options as ExecaOptions } from 'execa'
import { execaCommand } from 'execa'
import { runMain as _runMain } from 'citty'
import { main } from './core/main'
import type { Options } from './core/types'

export const runMain = () => _runMain(main)

export interface RunOptions extends ExecaOptions {
  transform: (stdout: string) => string | Promise<string>
}

export type RunCmd = string | ((prev: string | undefined, ctx: Record<string, string[]>) => string | Promise<string>)

const isString = (value: any): value is string => typeof value === 'string'

export function run(cmd: RunCmd, options: Partial<RunOptions> = {}) {
  return async function (prev: string | undefined, ctx: Record<string, string[]>) {
    cmd = isString(cmd) ? cmd : await cmd(prev, ctx)
    const { stdout } = await execaCommand(cmd, options)
    if (!options.transform)
      return stdout
    return options.transform(stdout)
  }
}

export function defineConfig(options: Options) {
  return options
}
