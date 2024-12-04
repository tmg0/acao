import type { Options } from './types'
import { parse } from 'node:path'
import process from 'node:process'
import { defu } from 'defu'
import JoyCon from 'joycon'
import { oxrun } from 'oxrun'
import { isString } from './utils'

async function bundleRequireTsmk(filepath: string): Promise<Options> {
  const mod = await oxrun.import(filepath)
  return mod.default
}

export async function loadTsmkConfig(cwd = process.cwd()) {
  const configJoycon = new JoyCon()
  const configPath = await configJoycon.resolve({
    files: [
      'tsmk.config.ts',
      'tsmk.config.cts',
      'tsmk.config.mts',
      'tsmk.config.js',
      'tsmk.config.cjs',
      'tsmk.config.mjs',
      'tsmk.config.json',
    ],
    cwd,
    stopDir: parse(cwd).root,
  })

  let defaults: Partial<Options>[] = []
  const options = await bundleRequireTsmk(configPath!)

  if (options.extends)
    defaults = await Promise.all([options.extends].flat().map(c => isString(c) ? bundleRequireTsmk(c) : c))

  return defu(options, ...defaults)
}
