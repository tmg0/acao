import { defineRunner } from '@core/runner'
import type { RunOptions } from '@core/types'
import { execa } from 'execa'
import { transformStdout } from '@core/utils'

export interface GitLogOptions extends RunOptions {
  number: number
  pretty: 'oneline' | 'reference' | undefined
  format: string
}

type GitCommandType = 'log'

function runGitCommand(command: GitCommandType, args: ((string | number) | (string | number)[])[] | [], options: Partial<RunOptions> = {}) {
  return execa(
    'git',
    [
      command,
      ...args.flat(),
    ].filter(Boolean).map(String),
    options,
  )
}

export function gitLog(options: Partial<GitLogOptions> = {}) {
  return defineRunner(async () => {
    const pretty = options.format ? `format:"${options.format}"` : options.pretty
    const { stdout } = await runGitCommand(
      'log',
      [
        `-${options.number ?? 1}`,
        pretty ? `--pretty=${pretty}` : '',
      ],
      options,
    )

    return transformStdout(stdout as string, options.transform)
  })
}
