import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: ['src/*.ts'],
  format: ['esm'],
  splitting: true,
  dts: true,
  clean: true,
  minify: !options.watch,
}))
