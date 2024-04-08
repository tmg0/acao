import { execaCommand } from 'execa'
import type { AcaoContext, AcaoJobStep, RunCmd, RunOptions } from './types'
import { isString, transformStdout } from './utils'

export function defineRunner(setup: AcaoJobStep) {
  return setup
}

export function execRunner(runner: AcaoJobStep) {
  return runner(undefined, {} as any)
}

export function run(cmd: RunCmd, options: Partial<RunOptions> = {}) {
  return defineRunner(async (prev: any, ctx: AcaoContext) => {
    const _cmd = isString(cmd) ? cmd : await cmd(prev, ctx)
    const ssh = options.ssh !== false && ctx.ssh
    options.beforeExec?.(ctx)
    const { stdout } = ssh ? await ssh?.execCommand(_cmd, options) : await execaCommand(_cmd, options)
    const output = await transformStdout(stdout, options.transform)
    options.afterExec?.(ctx)
    return output
  })
}
