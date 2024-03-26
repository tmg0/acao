# @acao/fs

Provide some functions for running in both locale and remote

## Usage

```ts
// acao.config.ts
import { defineConfig, run } from 'acao'
import { readFile } from 'acao/fs'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        readFile('~/docker-compose.yml', { stdio: 'inherit' }),
      ],
    },
  },
})
```

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
