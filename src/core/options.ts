import type { Options, SSHOptions } from './types'
import { defu } from 'defu'

export function resolveOptions(rawOptions: Partial<Options> | undefined | null = {}) {
  return defu(rawOptions, { jobs: {} }) as Options
}

export function resolveSSHOptions(rawOptions: Partial<SSHOptions> = {}) {
  return defu(rawOptions, { port: 22 }) as SSHOptions
}
