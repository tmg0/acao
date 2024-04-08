import { defineRunner } from '@core/runner'
import type { AcaoContext, RunCmd, RunOptions } from '@core/types'
import { execaCommand } from 'execa'
import { defu } from 'defu'
import { isFunction, isString, transformStdout } from '@core/utils'

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

export interface DockerRunOptions extends RunOptions {
  shell: string
  rm: boolean
  volume: Record<string, string>
}

export interface DockerRmiOptions extends RunOptions {
  force: boolean
}

type DockerCommandType = 'build' | 'buildx' | 'login' | 'push' | 'run' | 'rmi'

function getDockerCommand(command: DockerCommandType, args: ((string | number) | (string | number)[])[] | []) {
  return [
    'docker',
    command,
    ...args.flat(),
  ].filter(Boolean).map(String)
}

function runDockerCommand(cmd: string[], options: Partial<RunOptions>, ctx: AcaoContext) {
  const _cmd = cmd.join(' ')
  const ssh = options.ssh !== false && ctx.ssh
  return ssh ? ssh.execCommand(_cmd, options) : execaCommand(_cmd, options)
}

export function dockerBuild(options: RunCmd<Partial<DockerBuildOptions>>) {
  return defineRunner(async (prev, ctx) => {
    const _options = isFunction(options) ? await options(prev, ctx) : options

    const cmd = getDockerCommand('build', [
      _options.file ? ['-f', _options.file] : '',
      _options.tag ? ['-t', _options.tag] : '',
      _options.platform ? ['--platform', _options.platform] : '',
      _options.noCache ? '--no-cache' : '',
      _options.path || '.',
    ])

    if (_options.platform)
      cmd.splice(1, 0, 'buildx')

    const { stdout } = await runDockerCommand(cmd, _options, ctx)
    return transformStdout(stdout, _options.transform)
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

    return transformStdout(stdout, options.transform)
  })
}

export function dockerPush(image: RunCmd, options: Partial<RunOptions> = {}) {
  return defineRunner(async (prev, ctx) => {
    const _image = isString(image) ? image : await image(prev, ctx)
    const cmd = getDockerCommand('push', [_image])
    const { stdout } = await runDockerCommand(cmd, { shell: true, ...options }, ctx)
    return transformStdout(stdout, options.transform)
  })
}

export function dockerRun(image: string, cmd: RunCmd, rawOptions: Partial<DockerRunOptions> = {}) {
  const options = defu(rawOptions, { shell: 'bin/sh', rm: true, volume: { '.': '~' } }) as DockerRunOptions

  return defineRunner(async (prev, ctx) => {
    const _cmd = isString(cmd) ? cmd : await cmd(prev, ctx)
    const _volume = Object.entries(options.volume).map(item => ['-v', item.join(':')])
    const { stdout } = await runDockerCommand(getDockerCommand('run', [
      _volume.length ? _volume.flat() : [],
      options.rm ? '-rm' : '',
      image,
      options.shell ?? '',
      _cmd,
    ]), options, ctx)
    return transformStdout(stdout, options.transform)
  })
}

export function dockerRmi(image: RunCmd<string | string[]>, options: Partial<DockerRmiOptions> = {}) {
  return defineRunner(async (prev, ctx) => {
    const _image = isFunction(image) ? await image(prev, ctx) : image
    const { stdout } = await runDockerCommand(getDockerCommand('rmi', [
      options.force ? '-f' : '',
      [_image].flat(),
    ]), options, ctx)
    return transformStdout(stdout, options.transform)
  })
}
