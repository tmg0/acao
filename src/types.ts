import type { execa } from 'execa'

export interface GitOptions {
  branch: string
  commitSHA: string
  commitShortSHA: string
}

export interface Options {
  git: GitOptions
}

export type AcaoJobStep = (...args: any[]) => ReturnType<typeof execa>

export interface AcaoJob {
  steps: AcaoJobStep[]
}

export interface Acao {
  jobs: Record<string, AcaoJob>
}

export type GitCommand = 'log' | 'branch'
