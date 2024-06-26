import { defineCommand, runCommand } from 'citty'
import { description, version } from '../package.json'
import { checkUpdates } from './core/npm'

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
    record: import('./commands/record').then(r => r.default),
  },

  async run(ctx) {
    if (ctx.args._.length)
      return
    const run = await import('./commands/run').then(r => r.default)
    runCommand(run, { rawArgs: [] })
  },
})
