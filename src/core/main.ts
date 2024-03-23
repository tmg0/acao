import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import { version } from '../../package.json'
import type { AcaoJob, Options } from './types'

export const main = defineCommand({
  meta: { name: 'acao', version },

  args: {
    job: {
      type: 'positional',
      description: 'Specific job name',
      required: false,
    },
  },

  async run({ args: { _: filters } }) {
    const { config } = await loadConfig<Options>({ name: 'acao', globalRc: false })

    if (!config)
      return

    const ctx: Record<string, string[]> = {}

    const jobs = (() => {
      if (!filters?.length)
        return Object.entries(config.jobs)
      return filters.map(job => [job, config.jobs[job]]) as [string, AcaoJob][]
    })()

    for (const [name, job] of jobs) {
      if (!ctx[name])
        ctx[name] = []
      let index = 0
      for (const step of job.steps) {
        const prev = index > 0 ? ctx[name][index - 1] : undefined
        const stdout = await step(prev, ctx)
        ctx[name].push(stdout)
        index = index + 1
      }
    }
  },
})
