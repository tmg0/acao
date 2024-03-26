import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      acao: resolve(__dirname, 'src/index.ts'),
    },
  },
})
