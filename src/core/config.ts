import process from 'node:process'
import { parse } from 'node:path'
import JoyCon from 'joycon'
import createJiti from 'jiti'
import { defu } from 'defu'
import type { Options } from './types'
import { isString } from './utils'

const jiti = createJiti(undefined as unknown as string, {
  interopDefault: true,
  requireCache: false,
  esmResolve: true,
})

function bundleRequireAcao(filepath: string): Promise<Options> {
  return jiti(filepath)
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
