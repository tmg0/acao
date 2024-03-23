import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: ['src/index.ts', 'src/**/index.ts'],
  format: ['esm'],
  splitting: true,
  dts: true,
  clean: true,
  minify: !options.watch,
}))
