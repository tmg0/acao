import { execa } from 'execa'
import { defineRunner } from 'acao'
import type { AcaoContext, RunOptions } from 'acao'

export type VoltaRunCmd = string | ((prev: any, ctx: AcaoContext) => string | Promise<string>)

export interface VoltaRunOptions extends RunOptions {
  node: string
  npm: string
  yarn: string
  pnpm: string
}

type VoltaCommandType = 'run'

const isString = (value: any): value is string => typeof value === 'string'

function runVoltaCommand(command: VoltaCommandType, args: (string | string[])[] | [], options: Partial<VoltaRunOptions> = {}) {
  return execa(
    'volta',
    [
      command,
      ...args.flat(),
    ].filter(Boolean),
    options,
  )
}

export function voltaRun(cmd: VoltaRunCmd, options: Partial<VoltaRunOptions> = {}) {
  return defineRunner(async (prev, ctx) => {
    const _cmd = isString(cmd) ? cmd : await cmd(prev, ctx)
    const { stdout } = await runVoltaCommand(
      'run',
      [
        options.node ? ['--node', options.node] : '',
        options.npm ? ['--npm', options.npm] : '',
        options.yarn ? ['--yarn', options.yarn] : '',
        options.pnpm ? ['--pnpm', options.pnpm] : '',
        _cmd,
      ],
      options,
    )
    return stdout
  })
}
