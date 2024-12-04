import type { TsmkContext, RunOptions } from '@core/types'
import { defineRunner } from '@core/runner'
import { isString, transformStdout } from '@core/utils'
import { execaCommand } from 'execa'

export type VoltaRunCmd = string | ((prev: any, ctx: TsmkContext) => string | Promise<string>)

export type VoltaBinary = 'node' | 'npm' | 'yarn' | 'pnpm'

export type VoltaRunOptions = RunOptions & Record<VoltaBinary, any>

type VoltaCommandType = 'run' | 'which'

function runVoltaCommand(command: VoltaCommandType, args: (string | string[])[] | [], options: Partial<VoltaRunOptions> = {}) {
  return execaCommand(['volta', command, ...args.flat()].filter(Boolean).join(' '), options)
}

export function voltaRun(cmd: VoltaRunCmd, options: Partial<VoltaRunOptions> = {}) {
  return defineRunner(async (prev, ctx) => {
    const _cmd = isString(cmd) ? cmd : await cmd(prev, ctx)
    const { stdout } = await runVoltaCommand(
      'run',
      [
        options.node ? `--node=${options.node}` : '',
        options.npm ? `--npm=${options.npm}` : '',
        options.yarn ? `--yarn=${options.yarn}` : '',
        options.pnpm ? `--pnpm=${options.pnpm}` : '',
        _cmd,
      ],
      options,
    )
    return transformStdout(stdout as string, options.transform)
  })
}

export function voltaWhich(binary: VoltaBinary = 'node', options: Partial<VoltaRunOptions> = {}) {
  return defineRunner(async () => {
    const { stdout } = await runVoltaCommand(
      'which',
      [binary],
      options,
    )
    return transformStdout(stdout as string, options.transform)
  })
}
