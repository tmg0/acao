import { defineConfig } from 'tsup'
import Oxlint from 'unplugin-oxlint/esbuild'

export default defineConfig(options => ({
  entry: ['src/index.ts', 'src/**/index.ts'],
  format: ['cjs', 'esm'],
  splitting: true,
  dts: true,
  clean: true,
  minify: !options.watch,

  esbuildPlugins: [
    Oxlint({
      watch: !!options.watch,
      includes: ['src/**/*.ts'],
      deny: ['correctness'],
      packageManager: 'npm',
    }),
  ],
}))
