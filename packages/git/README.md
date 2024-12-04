# @tsmk/git

Provide some git commands

## Usage

### `gitLog`

Show commit logs

```ts
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'
import { gitLog } from 'tsmk/git'

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
