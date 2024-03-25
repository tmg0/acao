import { loadConfig } from 'c12'
import { defineCommand } from 'citty'
import type { Options } from '../types'
import { createAcao } from '../context'

export default defineCommand({
  meta: { name: 'preview' },
  async run() {
    const { config } = await loadConfig<Options>({ name: 'acao', rcFile: false })
    const ctx = createAcao(config)
    console.log(ctx.jobs)
  },
})
