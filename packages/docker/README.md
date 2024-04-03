# @acao/docker

A self-sufficient runtime for containers

## Usage

### `dockerBuild`

```ts
// acao.config.ts
import { defineConfig, run } from 'acao'
import { dockerBuild } from 'acao/docker'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        dockerBuild({ tag: 'TAG', file: 'Dockerfile', stdio: 'inherit' }),
      ],
    },
  },
})
```

### `dockerLogin`

```ts
// acao.config.ts
import { defineConfig, run } from 'acao'
import { dockerLogin } from 'acao/docker'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        dockerLogin('http://localhost', { username: 'root', password: '*' }),
      ],
    },
  },
})
```

### `dockerPush`

```ts
// acao.config.ts
import { defineConfig, run } from 'acao'
import { dockerPush } from 'acao/docker'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        dockerPush('DOCKER_IMAGE'),
      ],
    },
  },
})
```

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
