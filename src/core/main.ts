import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import { version } from '../../package.json'
import type { Options } from './types'
import { createAcao } from './context'

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
    const ctx = createAcao(config)
    await ctx.runJobs(filters)
  },
})
