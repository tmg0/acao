import { execaCommand } from 'execa'
import { runMain as _runMain } from 'citty'
import { destr } from 'destr'
import { main } from './core/main'
import type { AcaoContext, AcaoJobStep, Options, RunCmd, RunOptions } from './core/types'
import { isString } from './core/utils'

export const runMain = () => _runMain(main)

export function run(cmd: RunCmd, options: Partial<RunOptions> = {}): AcaoJobStep {
  return async function (prev: any, ctx: AcaoContext) {
    const _cmd = isString(cmd) ? cmd : await cmd(prev, ctx)
    const isRemote = options.ssh ?? !!ctx.ssh
    const { stdout } = isRemote ? await ctx.ssh?.execCommand(_cmd, options) : await execaCommand(_cmd, options)
    const response = destr<any>(stdout)
    if (!options.transform)
      return response
    return options.transform(response)
  }
}

export function defineConfig(options: Partial<Options>) {
  return options
}
