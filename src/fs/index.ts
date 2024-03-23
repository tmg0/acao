import type { AcaoJobStep, RunOptions } from '../core/types'

export interface ReadFileOptions extends RunOptions {

}

export function readFile(_path: string, options: ReadFileOptions): AcaoJobStep {
  return async function () {
    const stdout = ''
    if (!options.transform)
      return stdout
    return options.transform(stdout)
  }
}
