import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import { version } from '../../package.json'
import type { Options } from './types'

export const main = defineCommand({
  meta: { name: 'acao', version },

  args: {
    job: {
      type: 'positional',
      description: 'Specific job name',
      required: false,
    },
  },

  async run({ args: { _: argJobs } }) {
    const { config } = await loadConfig<Options>({ name: 'acao', globalRc: false })

    if (!config)
      return

    const jobs = argJobs ? Object.entries(config.jobs).filter(([name]) => argJobs.includes(name)) : Object.entries(config.jobs)

    for (const [_, job] of jobs) {
      const ctx: string[] = []
      for (const step of job.steps)
        ctx.push(await step(ctx))
    }
  },
})
