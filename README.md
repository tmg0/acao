# Ação

<sup>(/a'sɐ̃ʊ̃/, <em>action</em> in Portuguese)</sup>

[![NPM version](https://img.shields.io/npm/v/acao)](https://www.npmjs.com/package/acao)

🎬 Automate your software workflows with javascript. Make code review, unit test, and CI/CD works the way you want.

```bash
npx acao
```

## Features

🧲 Ordering based on the `needs` field for synchronous execution of jobs

🕹️ Support execute commands in a mix of local and remote environments by [ssh2](https://github.com/mscdex/ssh2#readme)

💻 Simple way to format and pass outputs to the next step defaults by [destr](https://github.com/unjs/destr#readme)

🎳 Support multiple types of config by [c12](https://github.com/unjs/c12)

🎁 Friendly command-line helps by [citty](https://github.com/unjs/citty)

✨ No installation required - `npx acao`

## Installation

```bash
# npm
npm i acao -D

# yarn
yarn add acao -D

# pnpm
pnpm add acao -D
```

## Usage

Run `acao` in terminal, typically at the same level as the `acao.config` file.

### `acao`

You can quick execute all your jobs with `acao`.

### `acao run <JOB>`

An alias for the `acao`

```bash
acao run
```

Can also specify a single job or list of jobs

```bash
acao run ci cd
```

### `acao preview`

Preview the execution order of jobs.

```bash
acao preview
```

## Config

`Acao` will execute jobs with order defined in the config file.

### `Basic`

Create `acao.config.ts`

```js
// acao.config.ts
import { defineConfig, run } from 'acao'

export default defineConfig({})
```

You can use `acao.config.{js,cjs,mjs,ts,mts,cts}` to specify configuration.

**Example**

```ts
// acao.config.ts
import { defineConfig, run } from 'acao'

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

```ts
run('echo Hello')
```

Using `run` in `job.steps` also provides a simple way to obtain the output from the previous step.

**Example**

```ts
// acao.config.ts
import { defineConfig, run } from 'acao'

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

Here are some extra options in the second parameter of `run`:

```ts
export interface RunOptions extends ExecaOptions {
  ssh: boolean
  transform: (stdout: string) => any | Promise<any>
}
```

**Example**

In the following example, the console will output `2`

```ts
// acao.config.ts
import { defineConfig, run } from 'acao'

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

### `defineRunner`

You can also wrap a custom step by using `defineRunner`

**Example**

```ts
import { execa } from 'execa'

const echoHello = defineRunner((prev, ctx) => {
  execa('echo', ['Hello'])
})
```

And `echoHello` can be used in jobs like:

```ts
// acao.config.ts
import { defineConfig, run } from 'acao'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        echoHello
      ],
    },
  },
})
```

### `Presets`

For common commands, `Acao` also provide some presets

🚧 More presets are coming soon!

- [~~`fs`~~](./packages/fs/README.md)
- [`git`](./packages/git/README.md)
- [`sed`](./packages/sed/README.md)
- [`volta`](./packages/volta/README.md)

Considering about removing the `fs` module from the presets in next version and recommend using `defineRunner` to wrap operations.

### `SSH`

Configuring connections in jobs through the `ssh` field to execute commands remotely and retrieve outputs.

If declared the `ssh` field, all steps under the current job will be executed remotely by default.

`Acao` will create an SSH connection at the start of the current `job` and close it after all `steps` in the current `job` have been executed.

You can mixin local command execution by declaring `ssh: false` in `run`.

**Example**

In the following example, the first command will be executed remotely, and the second command will be executed locally.

```ts
// acao.config.ts
import { defineConfig, run } from 'acao'

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
import { defineConfig, run } from 'acao'

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

### `options.extends`

- Type: `string | string[]`
- Default: `undefined`

It will be used to extend the configuration, and the final config is merged result of extended options and user options with [defu](https://github.com/unjs/defu).

**Example**

```ts
// acao.config.base.ts
import { defineConfig, run } from 'acao'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        run('echo Acao'),
      ],
    },
  },
})
```

```ts
// acao.config.ts
export default defineConfig({
  extends: ['./acao.config.base']
})
```

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
