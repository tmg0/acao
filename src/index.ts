import type { Options as ExecaOptions } from 'execa'
import { execaCommand } from 'execa'
import { runMain as _runMain } from 'citty'
import { main } from './main'
import type { Options } from './types'

export const runMain = () => _runMain(main)

export interface RunOptions extends ExecaOptions {
  transform: (stdout: string) => string | Promise<string>
}

export type RunCmd = string | ((ctx: string[]) => string | Promise<string>)

const isString = (value: any): value is string => typeof value === 'string'

export function run(cmd: RunCmd, options: Partial<RunOptions> = { stdio: 'inherit' }) {
  return async function (ctx: string[]) {
    cmd = isString(cmd) ? cmd : await cmd(ctx)
    const { stdout } = await execaCommand(cmd, options)
    if (!options.transform)
      return stdout
    return options.transform(stdout)
  }
}

export function defineConfig(options: Options) {
  return options
}
