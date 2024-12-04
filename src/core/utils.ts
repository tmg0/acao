import type { RunOptions, TsmkContext } from './types'
import { resolve } from 'node:path'
import process from 'node:process'
import { colors } from 'consola/utils'
import { destr } from 'destr'
import { execaCommand } from 'execa'
import { version } from '../../package.json'

export const isString = (value: any): value is string => typeof value === 'string'
export const isFunction = (value: any): value is ((...args: any[]) => any) => typeof value === 'function'

export async function execCommand(cmd: string, options: Partial<RunOptions>, ctx: TsmkContext) {
  const ssh = options.ssh !== false && ctx.ssh
  return ssh ? await ssh?.execCommand(cmd, options) : await execaCommand(cmd, options)
}

export function sleep(ms = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function transformStdout(stdout: string, transform?: RunOptions['transform']) {
  if (!transform)
    return destr(stdout)
  return transform(stdout)
}

export const spinnerFrames = process.platform === 'win32'
  ? ['-', '\\', '|', '/']
  : ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

export function elegantSpinner() {
  let index = 0

  return () => {
    index = ++index % spinnerFrames.length
    return spinnerFrames[index]
  }
}

export function pringBanner(logger: any = console) {
  logger.log()
  const _version = colors.blue(`v${version}`)
  logger.log(`${colors.inverse(colors.bold(' Tsmk '))} ${_version} ${colors.gray(resolve('.'))}`)
  logger.log()
}
