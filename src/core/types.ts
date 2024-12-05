import type { Options as ExecaOptions } from 'execa'
import type { Buffer } from 'node:buffer'
import type { Client } from 'ssh2'

export interface SSHOptions {
  host: string
  username: string
  password?: string
  port?: string | number
  privateKey?: Buffer | string
}

export type TsmkJobStep = (prev: any, ctx: TsmkContext) => Promise<any>

export interface TsmkJob {
  name?: string
  ssh?: SSHOptions
  needs?: string | string[]
  steps: (string | TsmkJobStep)[]
  beforeConnectSSH?: () => any | Promise<any>
  afterConnectSSH?: () => any | Promise<any>
  beforeExec?: () => any | Promise<any>
  afterExec?: () => any | Promise<any>
  afterCloseSSH?: () => any | Promise<any>
}

export type OptionsExtend = string | Partial<Options>

export interface Options {
  extends: OptionsExtend | OptionsExtend[]
  jobs: Record<string, TsmkJob>
  setup?: () => any | Promise<any>
  cleanup?: () => any | Promise<any>
}

export type RunCmd<T = string> = T | ((prev: any, ctx: TsmkContext) => T | Promise<T>)

export interface RunOptions extends ExecaOptions {
  ssh: boolean
  transform: (stdout: string) => any | Promise<any>
  beforeExec: (ctx: TsmkContext) => any | Promise<any>
  afterExec: (ctx: TsmkContext) => any | Promise<any>
}

export interface TsmkContext {
  options: Options
  args: Record<string, any>
  version: string
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
