import { defineRunner } from '@core/runner'
import type { RunOptions } from '@core/types'
import { execa } from 'execa'
import { destr } from 'destr'

export interface GitLogOptions extends RunOptions {
  number: number
  oneline: boolean
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
    const { stdout } = await runGitCommand(
      'log',
      [
        `-${options.number ?? 1}`,
        options.pretty ? `--pretty=${options.pretty}` : `--pretty=format:"${options.format}"`,
      ],
      options,
    )

    if (!options.transform)
      return destr(stdout)
    return options.transform(stdout)
  })
}
