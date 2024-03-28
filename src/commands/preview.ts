import { defineCommand } from 'citty'
import { createAcao } from '../core/context'
import { loadAcaoConfig } from '../core/config'

export default defineCommand({
  meta: { name: 'preview', description: 'Preview jobs' },
  async run() {
    const ctx = createAcao(await loadAcaoConfig())
    console.log(JSON.stringify(ctx.jobs, null, 2))
  },
})
