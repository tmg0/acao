import fg from 'fast-glob'
import { defineConfig } from 'tsup'

export default defineConfig(async (options) => {
  const presets: Record<string, string> = {}
  const packages = await fg(['packages/*/src/index.ts', '!packages/ui/**'])

  packages.forEach((path) => {
    const [_, name] = path.split('/')
    presets[name] = path
  })

  return {
    entry: {
      index: 'src/index.ts',
      ...presets,
    },

    format: ['esm'],
    splitting: true,
    dts: true,
    clean: true,
    minify: !options.watch,
  }
})
