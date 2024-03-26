import fs from 'node:fs/promises'
import { defineRunner } from 'acao'
import type { AcaoContext, RunOptions } from 'acao'

export interface ReadFileOptions extends RunOptions {}

export type ReadFilePath = string | ((prev: any, ctx: AcaoContext) => string | Promise<string>)

const isString = (value: any): value is string => typeof value === 'string'

export function readFile(path: ReadFilePath, options: Partial<ReadFileOptions> = {}) {
  return defineRunner(async (prev: any, ctx: AcaoContext) => {
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
  })
}
