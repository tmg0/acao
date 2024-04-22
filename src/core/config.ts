import process from 'node:process'
import { parse } from 'node:path'
import JoyCon from 'joycon'
import { bundleRequire } from 'bundle-require'
import { defu } from 'defu'
import type { Options } from './types'

async function bundleRequireAcao(filepath: string) {
  const config = await bundleRequire({
    filepath,
  })

  return (config.mod.acao || config.mod.default || config.mod) as Options
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

  let defaults: Options[] = []
  const options = await bundleRequireAcao(configPath!)

  if (options.extends)
    defaults = await Promise.all([options.extends].flat().map(bundleRequireAcao))

  return defu(options, ...defaults)
}
