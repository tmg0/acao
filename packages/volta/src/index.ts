import { execa } from 'execa'
import { defineRunner } from 'acao'
import type { AcaoContext, RunOptions } from 'acao'
import { destr } from 'destr'

export type VoltaRunCmd = string | ((prev: any, ctx: AcaoContext) => string | Promise<string>)

export type VoltaBinary = 'node' | 'npm' | 'yarn' | 'pnpm'

export type VoltaRunOptions = RunOptions & Record<VoltaBinary, string>

type VoltaCommandType = 'run' | 'which'

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
    if (!options.transform)
      return destr(stdout)
    return options.transform(stdout)
  })
}

export function voltaWhich(binary: VoltaBinary = 'node', options: Partial<VoltaRunOptions> = {}) {
  return defineRunner(async () => {
    const { stdout } = await runVoltaCommand(
      'which',
      [binary],
      options,
    )
    if (!options.transform)
      return destr(stdout)
    return options.transform(stdout)
  })
}
