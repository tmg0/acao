import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import type { Options } from '../types'
import { createAcao } from '../context'

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
    const { config } = await loadConfig<Options>({ name: 'acao', rcFile: false })
    await createAcao(config).runJobs(ctx.args._)
  },
})
