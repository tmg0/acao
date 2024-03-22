import process from 'node:process'
import { execa } from 'execa'
import type { GitCommand, GitOptions } from './types'

interface RunGitCommandOptions {
  cwd: string
}

export function runGitCommand(command: GitCommand, args: string[], options: RunGitCommandOptions) {
  return execa('git', [command, ...args].filter(Boolean), { cwd: options.cwd })
}

export async function resolveGit(cwd = process.cwd()): Promise<GitOptions> {
  const [branch, commitSHA, commitShortSHA] = await Promise.all([
    runGitCommand('branch', ['--show-current'], { cwd }),
    runGitCommand('log', ['-n', '1', '--pretty=format:\'%H\''], { cwd }),
    runGitCommand('log', ['-n', '1', '--pretty=format:\'%h\''], { cwd }),
  ])

  return {
    branch: branch.stdout,
    commitSHA: commitSHA.stdout,
    commitShortSHA: commitShortSHA.stdout,
  }
}
