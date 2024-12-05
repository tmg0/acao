import type { Options } from 'execa'
import type { SSH, SSHOptions } from './types'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { Client } from 'ssh2'
import { resolveSSHOptions } from './options'
import { isString } from './utils'

function isPrivateKey(value: string) {
  return value.includes('BEGIN RSA PRIVATE KEY')
}

export function createSSH(rawOptions?: SSHOptions): SSH | undefined {
  if (!rawOptions)
    return

  const options = resolveSSHOptions(rawOptions)
  const client = new Client()

  const config = {
    ...options,
    port: Number(options.port),
  }

  if (isString(options.privateKey) && !isPrivateKey(options.privateKey))
    config.privateKey = readFileSync(options.privateKey)

  function connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      client!.on('ready', resolve).on('error', reject).connect(config)
    })
  }

  function execCommand(cmd: string, options: Options = {}) {
    return new Promise((resolve, reject) => {
      client.exec(cmd, (err, stream) => {
        if (err) {
          reject(err)
          return
        }

        let stdout = ''
        let stderr = ''

        if (options.stdio === 'inherit') {
          stream.pipe(process.stdout)
          stream.stderr.pipe(process.stderr)
        }

        stream.on('close', () => {
          resolve({ stdout, stderr })
        }).on('data', (data: any) => {
          stdout += data.toString()
        }).stderr.on('data', (data) => {
          stderr += data.toString()
        })
      })
    })
  }

  function close() {
    return client.end()
  }

  return {
    client,
    connect,
    execCommand,
    close,
  }
}
