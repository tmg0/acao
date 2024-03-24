import fs from 'node:fs/promises'
import type { AcaoContext, AcaoJobStep, RunOptions } from '../core/types'
import { isString } from '../core/utils'

export interface ReadFileOptions extends RunOptions {}

export type ReadFilePath = string | ((prev: any, ctx: AcaoContext) => string | Promise<string>)

export function readFile(path: ReadFilePath, options: ReadFileOptions): AcaoJobStep {
  return async function (prev: string, ctx: AcaoContext) {
    const _path = isString(path) ? path : await path(prev, ctx)
    let stdout = ''
    const ssh = options.ssh && ctx.ssh
    if (!ssh)
      stdout = await fs.readFile(_path, { encoding: 'utf-8' })
    if (ssh)
      stdout = (await ctx.ssh?.execCommand(`cat ${_path}`, options)).stdout
    if (!options.transform)
      return stdout
    return options.transform(stdout)
  }
}
