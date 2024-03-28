import { defineCommand } from 'citty'
import { createAcao } from '../core/context'
import { runtimeConfig } from '../main'

export default defineCommand({
  meta: { name: 'preview', description: 'Preview jobs' },
  async run() {
    const ctx = createAcao(runtimeConfig.value)
    console.log(JSON.stringify(ctx.jobs, null, 2))
  },
})
