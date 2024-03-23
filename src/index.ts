import { execaCommand } from 'execa'
import { runMain as _runMain } from 'citty'
import { main } from './core/main'
import type { AcaoContext, AcaoRuntime, Options, RunOptions } from './core/types'

export const runMain = () => _runMain(main)

export type RunCmd = string | ((prev: string | undefined, ctx: AcaoContext, runtime: AcaoRuntime) => string | Promise<string>)

const isString = (value: any): value is string => typeof value === 'string'

export function run(cmd: RunCmd, options: Partial<RunOptions> = {}) {
  return async function (prev: string | undefined, ctx: AcaoContext, runtime: AcaoRuntime) {
    const _cmd = isString(cmd) ? cmd : await cmd(prev, ctx, runtime)
    const isRemote = options.ssh ?? !!runtime.ssh
    const { stdout } = isRemote ? await runtime.ssh?.execCommand(_cmd, options) : await execaCommand(_cmd, options)
    if (!options.transform)
      return stdout
    return options.transform(stdout)
  }
}

export function defineConfig(options: Partial<Options>) {
  return options
}
