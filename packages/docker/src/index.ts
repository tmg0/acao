import { defineRunner } from '@core/runner'
import type { AcaoContext, RunOptions } from '@core/types'
import { execaCommand } from 'execa'
import { destr } from 'destr'

export interface DockerBuildOptions extends RunOptions {
  file: string
  tag: string
  noCache: boolean
  platform: string
  path: string
}

export interface DockerLoginOptions extends Partial<RunOptions> {
  username: string
  password: string
}

type DockerCommandType = 'build' | 'buildx' | 'login' | 'push'

function getDockerCommand(command: DockerCommandType, args: ((string | number) | (string | number)[])[] | []) {
  return [
    command,
    ...args.flat(),
  ].filter(Boolean).map(String)
}

function runDockerCommand(cmd: string[], options: Partial<RunOptions>, ctx: AcaoContext) {
  const _cmd = cmd.join(' ')
  const ssh = options.ssh && ctx.ssh
  return ssh ? ssh.execCommand(_cmd, options) : execaCommand(_cmd, options)
}

export function dockerBuild(options: Partial<DockerBuildOptions>) {
  return defineRunner(async (_, ctx) => {
    const cmd = getDockerCommand('build', [
      options.file ? ['-f', options.file] : '',
      options.tag ? ['-t', options.tag] : '',
      options.platform ? ['--platform', options.platform] : '',
      options.noCache ? '--no-cache' : '',
      options.path || '.',
    ])

    if (options.platform)
      cmd.unshift('buildx')

    const { stdout } = await runDockerCommand(cmd, options, ctx)

    if (!options.transform)
      return destr(stdout)
    return options.transform(stdout)
  })
}

export function dockerLogin(host: string, options: DockerLoginOptions) {
  return defineRunner(async (_, ctx) => {
    const cmd = getDockerCommand('login', [
      '-u',
      options.username,
      '-p',
      options.password,
      host,
    ])

    const { stdout } = await runDockerCommand(cmd, options, ctx)

    if (!options.transform)
      return destr(stdout)
    return options.transform(stdout)
  })
}

export function dockerPush(image: string, options: Partial<RunOptions>) {
  return defineRunner(async (_, ctx) => {
    const cmd = getDockerCommand('push', [image])
    const { stdout } = await runDockerCommand(cmd, options, ctx)

    if (!options.transform)
      return destr(stdout)
    return options.transform(stdout)
  })
}
