# @tsmk/volta

Provide some volta commands

## Usage

### `voltaRun`

Run a command with custom Node, npm, pnpm, and/or Yarn versions

```ts
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'
import { voltaRun } from 'tsmk/volta'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        voltaRun('npm run build', { node: '18.19.1', stdio: 'inherit' }),
      ],
    },
  },
})
```

### `voltaWhich`

Locates the actual binary that will be called by Volta

```ts
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'
import { voltaWhich } from 'tsmk/volta'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        voltaWhich('node', { stdio: 'inherit' }),
      ],
    },
  },
})
```

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
