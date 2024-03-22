# Ação

<sup>(/a'sɐ̃ʊ̃/, <em>action</em> in Portuguese)</sup>

[![NPM version](https://img.shields.io/npm/v/acao)](https://www.npmjs.com/package/acao)

🎬 Automate your software workflows with javascript. Make code reviews, branch management, and issue triaging work the way you want.

## Features

🧲 Eesy way to tansform stdout and inject to the global context

🕹️ Supports specifying particular jobs for execution

💻 Fully operational in your local environment

🎳 Support multiple type of config files, powered by [c12](https://github.com/unjs/c12)

🎁 Friendly usage and help docs, powered by [citty](https://github.com/unjs/citty)

## Installation

```bash
pnpm add acao -D
```

## Usage

Create `acao.config.ts`

```js
// acao.config.ts
import { defineConfig, run } from './src/index'

export default defineConfig({})
```

You can use `acao.config.{js,cjs,mjs,ts,mts,cts}` to specify configuration.

**Example**

```ts
// acao.config.ts
import { defineConfig, run } from './src/index'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        run('Hello acao', { stdio: 'inherit' }),
      ],
    },
  },
})
```

## Options

### `options.jobs`

- Type: `Record<string, Job>`
- Default: `{}`

### `options.jobs.<key>.steps`

- Type: `(() => Promise<string>)[]`
- Default: `[]`

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
