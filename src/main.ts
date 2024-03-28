import { defineCommand, runCommand } from 'citty'
import { loadConfig } from 'c12'
import { description, version } from '../package.json'
import { checkUpdates } from './core/npm'
import type { Options } from './core/types'
import run from './commands/run'
import preview from './commands/preview'

export interface Global {
  value?: Options | null
}

export const runtimeConfig: Global = {
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
      const { config } = await loadConfig<Options>({ name: 'acao', rcFile: false })
      runtimeConfig.value = config
    }

    if (!args.noUpdateNotifier)
      await checkUpdates()
  },

  subCommands: { run, preview },

  run({ rawArgs }) {
    if (!rawArgs.length)
      runCommand(run, { rawArgs: [] })
  },
})
