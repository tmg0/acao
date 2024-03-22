import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import { version } from '../../package.json'
import type { Options } from './types'

export const main = defineCommand({
  meta: { name: 'acao', version },
  async run() {
    const { config } = await loadConfig<Options>({ name: 'acao', globalRc: false })

    if (!config)
      return

    for (const [_, job] of Object.entries(config.jobs)) {
      const ctx: string[] = []
      for (const step of job.steps)
        ctx.push(await step(ctx))
    }
  },
})
