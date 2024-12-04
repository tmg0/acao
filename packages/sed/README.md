# @tsmk/sed

Basic text transformations on an input stream

## Usage

```ts
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'
import { sedSubstitute } from 'tsmk/sed'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        sedSubstitute('~/docker-compose.yml', { inPlace: false, values: [{ find: '3', replacement: '2' }] }),
      ],
    },
  },
})
```

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
