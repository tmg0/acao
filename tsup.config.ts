import { defineConfig } from 'tsup'
import fg from 'fast-glob'
import Oxlint from 'unplugin-oxlint/esbuild'

export default defineConfig(async (options) => {
  const presets: Record<string, string> = {}
  const packages = await fg(['packages/*/src/index.ts'])

  packages.forEach((path) => {
    const [_, name] = path.split('/')
    presets[name] = path
  })

  return {
    entry: {
      index: 'src/index.ts',
      ...presets,
    },

    format: ['cjs', 'esm'],
    splitting: true,
    dts: true,
    clean: true,
    minify: !options.watch,

    esbuildPlugins: [
      Oxlint({
        watch: !!options.watch,
        includes: ['src/**/*.ts', 'packages/*/src/**/*.ts'],
        deny: ['correctness'],
        packageManager: 'npm',
      }),
    ],
  }
})
