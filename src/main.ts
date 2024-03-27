import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import { description, version } from '../package.json'
import { checkUpdates } from './core/npm'
import type { Options } from './core/types'

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
    const { config } = await loadConfig<Options>({ name: 'acao', rcFile: false })
    return config
  },
})
