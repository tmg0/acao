import { oraPromise } from 'ora'
import { version } from '../../package.json'
import { resolveOptions } from './options'
import { run } from './runner'
import { createSSH } from './ssh'
import type { AcaoContext, AcaoJob, Options } from './types'
import { isString } from './utils'

export interface RunJobsOptions {
  noNeeds: boolean
}

export function createAcao(rawOptions: Partial<Options> | undefined | null = {}, { args }: { args?: Record<string, any> } = {}) {
  const options = resolveOptions(rawOptions)
  const jobs = orderJobs(options.jobs)

  const ctx: AcaoContext = {
    options,
    version,
    args: args ?? {},
    outputs: {},
  }

  async function runJobs(filters: string[] = [], { noNeeds }: Partial<RunJobsOptions> = {}) {
    const ordered = filterJobs(noNeeds ? [jobs.flat()] : jobs, filters)

    options.setup?.()

    for (const batch of ordered) {
      await Promise.all(batch.map(name => (async function () {
        const job = options.jobs[name]
        const ssh = createSSH(job.ssh)

        async function _runSteps() {
          if (ssh) {
            await job.beforeConnectSSH?.()
            await ssh.connect()
            await job.afterConnectSSH?.()
          }

          if (!ctx.outputs[name])
            ctx.outputs[name] = []

          await job.beforeExec?.()

          let index = 0
          for (const step of job.steps) {
            const prev = index > 0 ? ctx.outputs[name][index - 1] : undefined
            const _step = isString(step) ? run(step) : step
            const stdout = await _step(prev, { ...ctx, job: name, step: index, ssh })
            ctx.outputs[name].push(stdout)
            index = index + 1
          }

          await job.afterExec?.()

          if (ssh) {
            ssh.close()
            await job.afterCloseSSH?.()
          }
        }

        await oraPromise(_runSteps, job.name ?? name)
      })()))
    }

    options.cleanup?.()
  }

  return {
    options,
    jobs,
    runJobs,
  }
}

export function filterJobs(jobs: string[][], filters: string[]) {
  const _flattenJobs = jobs.flat()

  filters = filters.filter(f => _flattenJobs.includes(f))

  if (!filters?.length)
    return jobs

  const _jobs: string[][] = []

  for (const batch of jobs) {
    if (!filters.some(name => batch.includes(name))) {
      _jobs.push(batch)
      continue
    }

    const requiredBatches = batch.filter(name => filters.includes(name))
    if (requiredBatches.length > 0) {
      _jobs.push(requiredBatches)
      break
    }
  }

  return _jobs
}

export function orderJobs(jobs: Record<string, AcaoJob>) {
  const inDegree: Record<string, number> = {}
  const graph: Record<string, string[]> = {}
  const sorted = []

  let queue: string[] = []

  for (const name of Object.keys(jobs)) {
    inDegree[name] = 0
    graph[name] = []
  }

  for (const [name, job] of Object.entries(jobs)) {
    const needs = [job.needs].flat().filter(Boolean) as string[]
    if (needs?.length) {
      for (const need of needs) {
        graph[need].push(name)
        inDegree[name]++
      }
    }
  }

  for (const [name, degree] of Object.entries(inDegree)) {
    if (degree === 0)
      queue.push(name)
  }

  while (queue.length) {
    const batch = []
    const nextQueue = []

    for (const name of queue) {
      batch.push(name)
      for (const next of graph[name]) {
        inDegree[next]--
        if (inDegree[next] === 0)
          nextQueue.push(next)
      }
    }

    sorted.push(batch)
    queue = nextQueue
  }

  if (sorted.flat().length !== Object.keys(jobs).length)
    return []

  return sorted
}
