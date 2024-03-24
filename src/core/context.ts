import { resolveOptions } from './options'
import { createSSH } from './ssh'
import type { AcaoContext, Options } from './types'
import { normalizeJobs, sliceRequiredJobs } from './utils'

export function createAcao(rawOptions: Partial<Options> | undefined | null = {}) {
  const options = resolveOptions(rawOptions)

  const ctx: AcaoContext = {
    options,
    outputs: {},
  }

  async function runJobs(requires: string[] = []) {
    const jobs = sliceRequiredJobs(normalizeJobs(options.jobs), requires)

    for (const batch of jobs) {
      await Promise.all(batch.map(job => (async function () {
        const ssh = createSSH(job.ssh)
        if (ssh)
          await ssh.connect?.()
        if (!ctx.outputs[job.name])
          ctx.outputs[job.name] = []
        let index = 0
        for (const step of job.steps) {
          const prev = index > 0 ? ctx.outputs[job.name][index - 1] : undefined
          const stdout = await step(prev, { ...ctx, job: job.name, step: index, ssh })
          ctx.outputs[job.name].push(stdout)
          index = index + 1
        }
        ssh?.close()
      })()))
    }
  }

  return {
    options,
    runJobs,
  }
}
