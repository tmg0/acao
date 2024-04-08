import { execaCommand } from 'execa'
import { defu } from 'defu'
import { defineRunner } from '@core/runner'
import type { RunCmd, RunOptions } from '@core/types'
import { isFunction, isString, transformStdout } from '@core/utils'

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

export function sedSubstitute(filename: RunCmd, rawOptions: RunCmd<Partial<SedSubstituteOptions>> = {}) {
  return defineRunner(async (prev, ctx) => {
    const _rawOptions = isFunction(rawOptions) ? await rawOptions(prev, ctx) : rawOptions
    const _filename = isString(filename) ? filename : await filename(prev, ctx)
    const _options = defu(_rawOptions, { global: true, delimiter: '|', inPlace: true, values: [] }) as SedSubstituteOptions

    const args = _options.values.map((value) => {
      return [
        's',
        value.find,
        value.replacement,
        value.global || _options.global ? 'g' : '',
      ].filter(Boolean).join(_options.delimiter)
    })

    const cmd = [
      'sed',
      _options.inPlace ? '-i' : '',
      args.map(item => (['-e', item])).flat(),
      _filename,
    ].flat().filter(Boolean).join(' ')

    const ssh = _options.ssh !== false && ctx.ssh
    const { stdout } = ssh ? await ssh?.execCommand(cmd, _options) : await execaCommand(cmd, _options)
    return transformStdout(stdout, _options.transform)
  })
}
