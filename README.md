# Ação

<sup>(/a'sɐ̃ʊ̃/, <em>action</em> in Portuguese)</sup>

[![NPM version](https://img.shields.io/npm/v/acao)](https://www.npmjs.com/package/acao)

🎬 Automate your software workflows with javascript. Make code review, unit test, and CI/CD works the way you want.

## Features

🧲 Ordering based on the `needs` field for synchronous execution of jobs

🕹️ Support for commands to be executed in a mix of local and remote environments by [ssh2](https://github.com/mscdex/ssh2#readme)

💻 Simple way to format and pass outputs to the next step defaults by [destr](https://github.com/unjs/destr#readme)

🎳 Support multiple type of config files by [c12](https://github.com/unjs/c12)

🎁 Friendly command-line helps by [citty](https://github.com/unjs/citty)

## Installation

```bash
# npm
npm i acao -D

# yarn
yarn add destr -D

# pnpm
pnpm add destr -D
```

## Usage

Execute `acao` in terminal, typically at the same level as the `acao.config` file. And then `acao` will execute jobs in the order defined in the config file.

### `Basic`

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
        run('echo Hello', { stdio: 'inherit' }),
      ],
    },
  },
})
```

### `Run`

`Acao` exposes a `run` method to execute commands by [execa](https://github.com/sindresorhus/execa).

**Example**

```ts
run('echo Hello')
```

Using `run` in `job.steps` also provides a simple way to obtain the output from the previous step.

**Example**

```ts
// acao.config.ts
import { defineConfig, run } from './src/index'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        run('echo Acao'),
        run((prev: string) => `echo Hello ${prev}`),
      ],
    },
  },
})
```

You can also configure `execa` through the second parameter, see [docs](https://github.com/sindresorhus/execa?tab=readme-ov-file#options-1).

If `stdio: inherit` is set, the console will use the child process's output. `prev` will be `undefined` in the next step, recommend to use this only when console output needs to be viewed.

There are some extra options in the second parameter of `run`:

```ts
export interface RunOptions extends ExecaOptions {
  ssh: boolean
  transform: (stdout: string) => any | Promise<any>
}
```

**Example**

console output: 2

```ts
// acao.config.ts
import { defineConfig, run } from './src/index'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        run('echo 1', { transform: stdout => Number(JSON.parse(stdout)) }),
        run((prev: number) => `echo ${prev + 1}`, { stdio: 'inherit' }),
      ],
    },
  },
})
```

### `SSH`

Configuring connections in jobs through the `ssh` field to execute commands remotely and retrieve outputs.

If declared the `ssh` field, all steps under the current job will be executed remotely by default.

`Acao` will create an SSH connection at the start of the current `job` and close it after all `steps` in the current `job` have been executed.

You can mixin local command execution by declaring `ssh: false` in `run`.

**Example**

In the following example, the first command will be executed remotely, and the second command will be executed locally.

```ts
// acao.config.ts
import { defineConfig, run } from './src/index'

export default defineConfig({
  jobs: {
    cd: {
      ssh: {
        host: process.env.SSH_HOST,
        username: process.env.SSH_USERNAME,
        password: process.env.SSH_PASSWORD,
      },

      steps: [
        run('cd ~ && ls', { stdio: 'inherit' }),
        run('cd ~ && ls', { stdio: 'inherit', ssh: false }),
      ],
    },
  },
})
```

### `Ordering`

Jobs support ordering through the `needs` field in `options.job` with `string` or `string[]`.

**Example**

In the following example, `second` will execute first, then `first` and `fourth` will execute sync, and finally, `third` will execute.

```ts
// acao.config.ts
import { defineConfig, run } from './src/index'

export default defineConfig({
  jobs: {
    first: {
      needs: 'second',
      steps: [
        run('echo 1', { stdio: 'inherit' }),
      ],
    },
    second: {
      steps: [
        run('echo 2', { stdio: 'inherit' }),
      ],
    },
    third: {
      needs: ['first', 'second'],
      steps: [
        run('echo 3', { stdio: 'inherit' }),
      ],
    },
    forth: {
      needs: ['second'],
      steps: [
        run('echo 4', { stdio: 'inherit' }),
      ],
    },
  },
})
```

## Options

### `options.jobs`

- Type: `Record<string, Job>`
- Default: `{}`

### `options.jobs.<key>.ssh`

- Type: `SSH`
- Default: `undefined`

```ts
interface SSH {
  host: string
  username: string
  password: string
  port?: number
}
```

### `options.jobs.<key>.steps`

- Type: `(() => Promise<string>)[]`
- Default: `[]`

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
