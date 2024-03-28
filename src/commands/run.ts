import { defineCommand } from 'citty'
import { createAcao } from '../core/context'
import { loadAcaoConfig } from '../core/config'

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
    await createAcao(await loadAcaoConfig()).runJobs(ctx.args._)
  },
})
