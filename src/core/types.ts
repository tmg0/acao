import type { Options as ExecaOptions } from 'execa'
import type { Client } from 'ssh2'

export interface SSHOptions {
  host: string
  username: string
  password: string
  port?: string | number
}

export type AcaoJobStep = (prev: string | undefined, ctx: AcaoContext) => Promise<string>

export interface AcaoJob {
  ssh?: SSHOptions
  steps: AcaoJobStep[]
}

export interface Options {
  extends: string | string[]
  jobs: Record<string, AcaoJob>
}

export interface RunOptions extends ExecaOptions {
  ssh: boolean
  transform: (stdout: string) => string | Promise<string>
}

export interface AcaoContext {
  options: Options
  job?: string
  step?: number
  ssh?: SSH | undefined
  outputs: Record<string, string[]>
}

export interface SSH {
  client: Client
  connect: () => Promise<any>
  execCommand: (cmd: string, options: ExecaOptions) => Promise<any>
  close: () => Client
}
