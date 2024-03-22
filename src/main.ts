import { defineCommand } from 'citty'
import { loadConfig } from 'c12'
import { version } from '../package.json'
import { resolveGit } from './git'
import type { DefineConfigOptions } from '.'

export const main = defineCommand({
  meta: { name: 'acao', version },
  async run() {
    const { config } = await loadConfig<DefineConfigOptions>({ name: 'acao' })
    if (!config)
      return

    const git = await resolveGit()
    const options = { git }

    const jobs = config(options)?.jobs ?? {}

    for (const [_, job] of Object.entries(jobs)) {
      for (const step of job.steps)
        await step
    }
  },
})
