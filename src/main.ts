import { defineCommand, runCommand } from 'citty'
import { description, version } from '../package.json'
import run from './commands/run'
import { checkUpdates } from './core/npm'

export const main = defineCommand({
  meta: { name: 'tsmk', version, description },

  args: {
    noUpdateNotifier: {
      type: 'boolean',
      description: 'Ignore tsmk update notifier',
      required: false,
      default: false,
    },
  },

  async setup({ args }) {
    if (!args.noUpdateNotifier)
      await checkUpdates()
  },

  subCommands: { run },

  async run(ctx) {
    if (ctx.args._.length)
      return
    runCommand(run, { rawArgs: [] })
  },
})
