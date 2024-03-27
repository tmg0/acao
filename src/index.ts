import { execaCommand } from 'execa'
import { runMain as _runMain } from 'citty'
import { destr } from 'destr'
import { main } from './main'
import type { AcaoContext, AcaoJobStep, Options, RunCmd, RunOptions } from './core/types'
import { isString } from './core/utils'

export * from './core/types'

export const runMain = () => _runMain(main)

export function run(cmd: RunCmd, options: Partial<RunOptions> = {}) {
  return defineRunner(async (prev, ctx) => {
    console.log('setup runner')
    const _cmd = isString(cmd) ? cmd : await cmd(prev, ctx)
    const ssh = options.ssh && ctx.ssh
    console.log('running cmd')
    console.log(`has ssh: ${!!ssh}`)
    const { stdout } = ssh ? await ctx.ssh?.execCommand(_cmd, options) : await execaCommand(_cmd, options)
    console.log('running cmd')
    if (!options.transform)
      return destr(stdout)
    return options.transform(stdout)
  })
}

export function defineRunner(setup: AcaoJobStep) {
  return setup
}

export function runRunner(runner: AcaoJobStep, ctx: Partial<AcaoContext> = {}) {
  return runner(undefined, ctx as AcaoContext)
}

export function defineConfig(options: Partial<Options>) {
  return options
}
