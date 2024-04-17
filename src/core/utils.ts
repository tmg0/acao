import process from 'node:process'
import { destr } from 'destr'
import type { RunOptions } from './types'

export const isString = (value: any): value is string => typeof value === 'string'
export const isFunction = (value: any): value is Function => typeof value === 'function'

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
