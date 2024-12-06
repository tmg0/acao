import type { RunOptions, TsmkContext } from '@core/types'
import { defineRunner } from '@core/runner'
import { execCommand, isFunction, transformStdout } from '@core/utils'

export interface ScpOptions extends RunOptions {
  source: string
  target: string
  sshConfig?: string
  identityFile?: string
  port?: string | number
  cipher?: boolean
  r?: boolean
}

function runScpCommand(args: (string | string[])[] | string, options: RunOptions, ctx: TsmkContext) {
  const cmd = ['scp', ...args].flat().filter(Boolean).join(' ')
  return execCommand(cmd, options, ctx)
}

export function scp(options: ScpOptions) {
  return defineRunner(async (prev, ctx) => {
    const _options = isFunction(options) ? await options(prev, ctx) : options

    const { stdout } = await runScpCommand([
      options.sshConfig ? ['-F', options.sshConfig] : '',
      options.identityFile ? ['-i', options.identityFile] : '',
      options.port ? ['-P', String(options.port)] : '',
      options.cipher ? '-c' : '',
      options.r ? '-r' : '',
      options.source,
      options.target,
    ], _options, ctx)

    return transformStdout(stdout as string, options.transform)
  })
}
