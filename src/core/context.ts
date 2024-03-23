import { resolveOptions } from './options'
import { createSSH } from './ssh'
import type { AcaoContext, AcaoJob, Options } from './types'

export function createAcao(rawOptions: Partial<Options> | undefined | null = {}) {
  const options = resolveOptions(rawOptions)

  const ctx: AcaoContext = {
    options,
    outputs: {},
  }

  async function runJobs(filters: string[] = []) {
    const jobs = (() => {
      if (!filters?.length)
        return Object.entries(options.jobs)
      return filters.map(job => [job, options.jobs[job]]) as [string, AcaoJob][]
    })()

    for (const [name, job] of jobs) {
      const ssh = createSSH(job.ssh)
      if (ssh)
        await ssh.connect?.()
      if (!ctx.outputs[name])
        ctx.outputs[name] = []
      let index = 0
      for (const step of job.steps) {
        const prev = index > 0 ? ctx.outputs[name][index - 1] : undefined
        const stdout = await step(prev, { ...ctx, job: name, step: index, ssh })
        ctx.outputs[name].push(stdout)
        index = index + 1
      }
      ssh?.close()
    }
  }

  return {
    options,
    runJobs,
  }
}
