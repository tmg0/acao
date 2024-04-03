import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      'acao': resolve(__dirname, 'src/index.ts'),
      '@core/runner': resolve(__dirname, 'src/core/runner.ts'),
      '@core/utils': resolve(__dirname, 'src/core/utils.ts'),
      '@core/types': resolve(__dirname, 'src/core/types.ts'),
    },
  },
})
