import { defineCommand, runCommand } from 'citty'
import { loadConfig } from 'c12'
import { description, version } from '../package.json'
import { checkUpdates } from './core/npm'
import type { Options } from './core/types'

export interface RuntimeConfig {
  value?: Options | null
}

export const runtimeConfig: RuntimeConfig = {
  value: undefined,
}

export const main = defineCommand({
  meta: { name: 'acao', version, description },

  args: {
    noUpdateNotifier: {
      type: 'boolean',
      description: 'Ignore Acao update notifier',
      required: false,
      default: false,
    },
  },

  async setup({ args }) {
    if (!runtimeConfig.value) {
      const { config } = await loadConfig<Options>({ name: 'acao', rcFile: false, defaultConfig: { jobs: {} } as any })
      runtimeConfig.value = config
    }

    if (!args.noUpdateNotifier)
      await checkUpdates()
  },

  subCommands: {
    run: import('./commands/run').then(r => r.default),
    preview: import('./commands/preview').then(r => r.default),
  },

  async run({ rawArgs }) {
    if (rawArgs.length)
      return
    const run = await import('./commands/run').then(r => r.default)
    runCommand(run, { rawArgs: [] })
  },
})
