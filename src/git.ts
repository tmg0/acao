import process from 'node:process'
import { join } from 'node:path'
import { execa } from 'execa'
import fse from 'fs-extra'
import type { GitCommand, GitOptions } from './types'

interface RunGitCommandOptions {
  cwd: string
}

export function runGitCommand(command: GitCommand, args: string[], options: RunGitCommandOptions) {
  return execa('git', [command, ...args].filter(Boolean), { cwd: options.cwd })
}

export function hasGit(cwd = process.cwd()) {
  return fse.pathExists(join(cwd, '.git'))
}

export async function resolveGit(cwd = process.cwd()): Promise<GitOptions | undefined> {
  if (!await hasGit(cwd))
    return

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
