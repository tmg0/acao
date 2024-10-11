import type { Options } from './types'
import { parse } from 'node:path'
import process from 'node:process'
import { defu } from 'defu'
import JoyCon from 'joycon'
import { oxrun } from 'oxrun'
import { isString } from './utils'

async function bundleRequireAcao(filepath: string): Promise<Options> {
  const mod = await oxrun.import(filepath)
  return mod.default
}

export async function loadAcaoConfig(cwd = process.cwd()) {
  const configJoycon = new JoyCon()
  const configPath = await configJoycon.resolve({
    files: [
      'acao.config.ts',
      'acao.config.cts',
      'acao.config.mts',
      'acao.config.js',
      'acao.config.cjs',
      'acao.config.mjs',
      'acao.config.json',
    ],
    cwd,
    stopDir: parse(cwd).root,
  })

  let defaults: Partial<Options>[] = []
  const options = await bundleRequireAcao(configPath!)

  if (options.extends)
    defaults = await Promise.all([options.extends].flat().map(c => isString(c) ? bundleRequireAcao(c) : c))

  return defu(options, ...defaults)
}
