import { execaCommand } from 'execa'
import { defu } from 'defu'
import { defineRunner } from '@core/runner'
import type { RunOptions } from '@core/types'
import { transformStdout } from '@core/utils'

export interface SubstituteValue {
  find: string
  replacement: string
  global?: boolean
}

export interface SedSubstituteOptions extends RunOptions {
  global: boolean
  delimiter: string
  inPlace: string | boolean
  values: SubstituteValue[]
}

export function sedSubstitute(filename: string, rawOptions: Partial<SedSubstituteOptions> = {}) {
  const options = defu(rawOptions, { global: true, delimiter: '|', inPlace: true, values: [] }) as SedSubstituteOptions

  const args = options.values.map((value) => {
    return [
      's',
      value.find,
      value.replacement,
      value.global || options.global ? 'g' : '',
    ].filter(Boolean).join(options.delimiter)
  })

  const cmd = [
    'sed',
    options.inPlace ? '-i' : '',
    args.map(item => (['-e', item])).flat(),
    filename,
  ].flat().filter(Boolean).join(' ')

  return defineRunner(async (_, ctx) => {
    const ssh = options.ssh !== false && ctx.ssh
    const { stdout } = ssh ? await ssh?.execCommand(cmd, options) : await execaCommand(cmd, options)
    return transformStdout(stdout, options.transform)
  })
}
