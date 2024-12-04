# tsmk

[![NPM version](https://img.shields.io/npm/v/tsmk)](https://www.npmjs.com/package/tsmk)

🎬 Make code review, unit test, and CI/CD works the way just like github actions with typescript.

```bash
npx tsmk
```

## Features

🧲 Ordering based on the `needs` field for synchronous execution of jobs

🕹️ Support execute commands in a mix of local and remote environments by [ssh2](https://github.com/mscdex/ssh2#readme)

💻 Simple way to format and pass outputs to the next step defaults by [destr](https://github.com/unjs/destr#readme)

🎳 Support multiple types of config by [joycon](https://github.com/egoist/joycon)

🎁 Friendly command-line helps by [citty](https://github.com/unjs/citty)

✨ No installation required - `npx tsmk`

## Installation

```bash
# npm
npm i tsmk -D

# yarn
yarn add tsmk -D

# pnpm
pnpm add tsmk -D
```

## Usage

Run `tsmk` in terminal, typically at the same level as the `tsmk.config` file.

### `tsmk`

You can quick execute all your jobs with `tsmk`.

### `tsmk run <JOB>`

An alias for the `tsmk`

```bash
tsmk run
```

Can also specify a single job or list of jobs.

```bash
tsmk run ci cd
```

If there are dependency relationships based on `needs` between jobs, `tsmk` will execute the dependent items by default.

This can be overridden by using the `noNeeds` parameter to run a specific job independently.

```bash
tsmk run cd --noNeeds
```

Normally a job with dependencies will require the output of its dependencies.

And args can be achieved by adding parameters to the command line to inject values into the context.

```bash
tsmk run cd --noNeeds --image IMAGE:TAG
```

In the following example, `IMAGE:TAG` will be output to the console.

```ts
// tsmk.config.ts
import { defineConfig, run } from './src'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        'echo ci',
      ]
    },

    cd: {
      needs: 'ci',

      steps: [
        run((_, ctx) => `echo ${ctx.args.image}`, { stdio: 'inherit' }),
      ]
    }
  },
})
```

### `tsmk record`

Record your input and generate a tsmk config file.

```bash
tsmk record
```

## Config

`tsmk` will execute jobs with order defined in the config file.

### `Basic`

Create `tsmk.config.ts`

```js
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'

export default defineConfig({})
```

You can use `tsmk.config.{js,cjs,mjs,ts,mts,cts}` to specify configuration.

String can also be used as a `step` in `jobs`, if there is no need to use the extended capabilities of `run`, you can defined the configuration file in  `tsmk.config.json` file and execute it with `npx tsmk`.

**Example**

```ts
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        run('echo Hello', { stdio: 'inherit' }),
        'echo tsmk'
      ],
    },
  },
})
```

### `Run`

`tsmk` exposes a `run` method to execute commands by [execa](https://github.com/sindresorhus/execa).

```ts
run('echo Hello')
```

Using `run` in `job.steps` also provides a simple way to obtain the output from the previous step.

**Example**

```ts
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        run('echo tsmk'),
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
  beforeExec: (ctx: TsmkContext) => any | Promise<any>
  afterExec: (ctx: TsmkContext) => any | Promise<any>
}
```

**Example**

In the following example, the console will output `2`

```ts
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'

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
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'

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

For common commands, `tsmk` also provide some presets

- [`docker`](./packages/docker/README.md)
- [`git`](./packages/git/README.md)
- [`sed`](./packages/sed/README.md)
- [`volta`](./packages/volta/README.md)

### `SSH`

Configuring connections in jobs through the `ssh` field to execute commands remotely and retrieve outputs.

If declared the `ssh` field, all steps under the current job will be executed remotely by default.

`tsmk` will create an SSH connection at the start of the current `job` and close it after all `steps` in the current `job` have been executed.

You can mixin local command execution by declaring `ssh: false` in `run`.

**Example**

In the following example, the first command will be executed remotely, and the second command will be executed locally.

```ts
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'

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
// tsmk.config.ts
import { defineConfig, run } from 'tsmk'

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
// tsmk.config.base.ts
import { defineConfig, run } from 'tsmk'

export default defineConfig({
  jobs: {
    ci: {
      steps: [
        run('echo tsmk'),
      ],
    },
  },
})
```

```ts
// tsmk.config.ts
export default defineConfig({
  extends: ['./tsmk.config.base']
})
```

### `options.jobs`

- Type: `Record<string, Job>`
- Default: `{}`

### `options.setup`

- Type: `() => Promise<any>`
- Default: `undefined`

### `options.cleanup`

- Type: `() => Promise<any>`
- Default: `undefined`

### `options.jobs.<KEY>.ssh`

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

### `options.jobs.<KEY>.beforeConnectSSH`

- Type: `() => Promise<any>`
- Default: `undefined`

### `options.jobs.<KEY>.afterConnectSSH`

- Type: `() => Promise<any>`
- Default: `undefined`

### `options.jobs.<KEY>.beforeExec`

- Type: `() => Promise<any>`
- Default: `undefined`

### `options.jobs.<KEY>.afterExec`

- Type: `() => Promise<any>`
- Default: `undefined`

### `options.jobs.<KEY>.afterCloseSSH`

- Type: `() => Promise<any>`
- Default: `undefined`

### `options.jobs.<KEY>.steps`

- Type: `(string | (() => Promise<string>))[]`
- Default: `[]`

## License

[MIT](./LICENSE) License © 2024-PRESENT [Tamago](https://github.com/tmg0)
