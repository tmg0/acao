import type { AcaoContext, AcaoJobStep, RunCmd, RunOptions } from './types'
import { execCommand, isString, transformStdout } from './utils'

export function defineRunner(setup: AcaoJobStep) {
  return setup
}

export function execRunner(runner: AcaoJobStep) {
  return runner(undefined, {} as any)
}

export function run(cmd: RunCmd, options: Partial<RunOptions> = {}) {
  return defineRunner(async (prev: any, ctx: AcaoContext) => {
    const _cmd = isString(cmd) ? cmd : await cmd(prev, ctx)
    options.beforeExec?.(ctx)
    const { stdout } = await execCommand(_cmd, options, ctx)
    const output = await transformStdout(stdout, options.transform)
    options.afterExec?.(ctx)
    return output
  })
}
