# @tsmk/docker

A self-sufficient runtime for containers

## Usage

### `dockerBuild`

```ts
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'
import { dockerBuild } from 'tsmk/docker'

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
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'
import { dockerLogin } from 'tsmk/docker'

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
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'
import { dockerPush } from 'tsmk/docker'

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

### `dockerRun`

```ts
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'
import { dockerRun } from 'tsmk/docker'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        dockerRun('node:18', 'npm install && npm run build', { volume: { dist: '~/dist' } }),
      ],
    },
  },
})
```

### `dockerRmi`

```ts
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'
import { dockerRmi } from 'tsmk/docker'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        dockerRmi(['node:18', 'node:20']),
      ],
    },
  },
})
```

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
