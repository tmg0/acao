import { type Options, execa } from 'execa'

export type VoltaCommand = 'run'

export function runVoltaCommand(command: VoltaCommand, args: string[], options: Options = {}) {
  return execa('volta', [command, ...args].filter(Boolean), { cwd: options.cwd })
}

export function voltaRun() {}
