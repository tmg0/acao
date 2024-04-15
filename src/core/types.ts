import type { Options as ExecaOptions } from 'execa'
import type { Client } from 'ssh2'

export interface SSHOptions {
  host: string
  username: string
  password: string
  port?: string | number
}

export type AcaoJobStep = (prev: any, ctx: AcaoContext) => Promise<any>

export interface AcaoJob {
  ssh?: SSHOptions
  needs?: string | string[]
  steps: (string | AcaoJobStep)[]
  beforeConnectSSH?: () => any | Promise<any>
  afterConnectSSH?: () => any | Promise<any>
  beforeExec?: () => any | Promise<any>
  afterExec?: () => any | Promise<any>
  afterCloseSSH?: () => any | Promise<any>
}

export interface Options {
  extends: string | string[]
  jobs: Record<string, AcaoJob>
  setup?: () => any | Promise<any>
  cleanup?: () => any | Promise<any>
}

export type RunCmd<T = string> = T | ((prev: any, ctx: AcaoContext) => T | Promise<T>)

export interface RunOptions extends ExecaOptions {
  ssh: boolean
  transform: (stdout: string) => any | Promise<any>
  beforeExec: (ctx: AcaoContext) => any | Promise<any>
  afterExec: (ctx: AcaoContext) => any | Promise<any>
}

export interface AcaoContext {
  options: Options
  args: Record<string, any>
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
