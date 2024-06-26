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

`options.number`

- Type: `number`
- Default: `0`

`options.pretty`

- Type: `'oneline' | 'reference'`
- Default: `undefined`

`options.format`

The target string will be passed to `--pretty:format=` if this option be declared.

- Type: `string`
- Default: `undefined`

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
