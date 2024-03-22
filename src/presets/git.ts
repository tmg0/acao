import { type Options, execa } from 'execa'

export type GitCommand = 'log' | 'branch'

export interface GitOptions {
  branch: string
  commitSHA: string
  commitShortSHA: string
}

export function runGitCommand(command: GitCommand, args: string[] | string[][], options: Options = {}) {
  return execa('git', [command, ...args.flat()].filter(Boolean), { cwd: options.cwd })
}

export interface GitBranchProps {
  showCurrent?: boolean
}

export function gitBranch(props: GitBranchProps = {}, options: Options = {}) {
  return runGitCommand(
    'branch',
    [
      props.showCurrent ? '--show-current' : '',
    ],
    options,
  )
}

export interface GitLogProps {
  n?: number
  pretty?: string
}

export function gitLog(props: GitLogProps = {}, options: Options = {}) {
  return runGitCommand(
    'log',
    [
      props.n ? ['-n', String(props.n)] : [],
      props.pretty ? ['--pretty', props.pretty] : [],
    ],
    options,
  )
}
