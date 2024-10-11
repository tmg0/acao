import { defineCommand } from 'citty'
import { loadAcaoConfig } from '../core/config'
import { createAcao } from '../core/context'

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
      description: 'Ignore Acao update notifier',
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
    await createAcao(await loadAcaoConfig(), { args: ctx.args }).runJobs(ctx.args._, { noNeeds: ctx.args.noNeeds })
  },
})
