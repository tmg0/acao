import { defineCommand } from 'citty'
import { createAcao } from '../core/context'
import { runtimeConfig } from '../main'

export default defineCommand({
  meta: { name: 'run', description: 'Run jobs' },

  args: {
    JOB: {
      type: 'positional',
      description: 'Specific job name, single job or list of jobs',
      required: false,
    },
  },

  async run(ctx) {
    await createAcao(runtimeConfig.value).runJobs(ctx.args._)
  },
})
