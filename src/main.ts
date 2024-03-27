import { defineCommand, runCommand } from 'citty'
import { description, version } from '../package.json'
import { checkUpdates } from './core/npm'
import run from './commands/run'

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

  run() {
    console.log('setup main')
  },
})
