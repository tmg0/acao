import type { Options } from 'execa'
import { defineRunner } from 'acao'
import type { AcaoContext } from 'acao'

export type VoltaRunCmd = string | ((prev: any, ctx: AcaoContext) => string | Promise<string>)

const isString = (value: any): value is string => typeof value === 'string'

export function voltaRun(cmd: VoltaRunCmd, _options: Options = {}) {
  return defineRunner(async (prev, ctx) => {
    const _cmd = isString(cmd) ? cmd : await cmd(prev, ctx)
    return _cmd
  })
}
