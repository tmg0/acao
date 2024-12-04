import { defineCommand } from 'citty'
import { loadTsmkConfig } from '../core/config'
import { createTsmk } from '../core/context'

export default defineCommand({
  meta: { name: 'run', description: 'Run jobs' },

  args: {
    JOB: {
      type: 'positional',
      description: 'Specific job name, single job or list of jobs',
      required: false,
    },

    noUpdateNotifier: {
      type: 'boolean',
      description: 'Ignore tsmk update notifier',
      required: false,
      default: false,
    },

    noNeeds: {
      type: 'boolean',
      description: 'Run sepcify job(s) without dependencies',
      required: false,
      default: false,
    },
  },

  async run(ctx) {
    await createTsmk(await loadTsmkConfig(), { args: ctx.args }).runJobs(ctx.args._, { noNeeds: ctx.args.noNeeds })
  },
})
