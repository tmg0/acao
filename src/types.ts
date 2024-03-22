import type { execaCommand } from 'execa'

export interface GitOptions {
  branch: string
  commitSHA: string
  commitShortSHA: string
}

export interface Options {
  git: GitOptions
}

export type AcaoJobStep = (...args: any[]) => ReturnType<typeof execaCommand>

export interface AcaoJob {
  steps: any[]
}

export interface Acao {
  jobs: Record<string, AcaoJob>
}
