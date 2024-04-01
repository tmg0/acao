# @acao/git

Provide some git commands

## Usage

### `gitLog`

Show commit logs

```ts
// acao.config.ts
import { defineConfig, run } from 'acao'
import { gitLog } from 'acao/git'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        gitLog({ format: '%h' }),
      ],
    },
  },
})
```

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
